import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession, saveSession, deleteSession } from '@/models/ChatSession';
import { processChatMessageWithGroq } from '@/services/groqChat';
import { processChatMessage as processChatMessageWithGemini } from '@/services/geminiChat';
import { calculateCompleteness, getMissingRequiredFields } from '../../../../shared/crimeSchemas.js';

async function processIncomingChatMessage(params) {
  // Prefer Groq if key is set, otherwise try Gemini, otherwise fallback
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    return processChatMessageWithGroq(params);
  }
  return processChatMessageWithGemini(params);
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { sessionId, message, lang = 'en', consent = true } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message text is required.' }, { status: 400 });
    }

    // Generate or use existing sessionId
    if (!sessionId) {
      sessionId = 'cs_' + crypto.randomUUID();
    }

    // Retrieve or initialize session
    let session = await getSession(sessionId);
    if (!session) {
      session = {
        sessionId,
        crimeType: null,
        language: lang,
        consentGiven: Boolean(consent),
        currentPromptField: null,
        collectedData: {},
        messages: [],
        isCompleted: false,
      };
    }

    // Add user message to history
    session.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });

    // Process through Hybrid Groq LLM / Gemini / Fallback Engine
    const result = await processIncomingChatMessage({
      message,
      currentCrimeType: session.crimeType,
      collectedData: session.collectedData || {},
      currentPromptField: session.currentPromptField,
      language: lang || session.language,
      sessionId,
    });

    // Update session state
    session.crimeType = result.crimeType || session.crimeType;
    session.collectedData = result.updatedData || session.collectedData;
    session.currentPromptField = result.currentPromptField;
    session.isCompleted = Boolean(result.isCompleted);
    if (result.language) {
      session.language = result.language;
    }

    // Add bot reply to history
    session.messages.push({
      sender: 'bot',
      text: result.reply,
      timestamp: new Date(),
      metadata: {
        fallbackUsed: Boolean(result.fallbackUsed),
        currentPromptField: result.currentPromptField,
      },
    });

    // Save session in DB (with 24h TTL)
    await saveSession(sessionId, session);

    // Compute metrics
    const missing = getMissingRequiredFields(session.crimeType, session.collectedData);
    const completeness = calculateCompleteness(session.crimeType, session.collectedData);

    return NextResponse.json({
      sessionId,
      reply: result.reply,
      crimeType: session.crimeType,
      collectedData: session.collectedData,
      currentPromptField: session.currentPromptField,
      missingFields: missing,
      completeness,
      isCompleted: session.isCompleted,
      language: session.language,
      fallbackUsed: Boolean(result.fallbackUsed),
      engine: result.engine || (result.fallbackUsed ? 'fallback' : 'groq'),
      options: result.options || null,
      messages: session.messages,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: error.message || 'Internal chat processing error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId query parameter is required.' }, { status: 400 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found or expired.' }, { status: 404 });
    }

    const missing = getMissingRequiredFields(session.crimeType, session.collectedData);
    const completeness = calculateCompleteness(session.crimeType, session.collectedData);

    return NextResponse.json({
      sessionId,
      crimeType: session.crimeType,
      collectedData: session.collectedData,
      currentPromptField: session.currentPromptField,
      missingFields: missing,
      completeness,
      isCompleted: session.isCompleted,
      language: session.language,
      messages: session.messages || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required.' }, { status: 400 });
    }

    await deleteSession(sessionId);
    return NextResponse.json({ success: true, message: 'Session data permanently wiped.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
