import { NextResponse } from 'next/server';
import { createComplaintRecord, listAllComplaints } from '@/models/Complaint';
import { buildFormalEnglishComplaint, buildTranslatedComplaint } from '@/services/complaintTextBuilder';
import { calculateCompleteness } from '../../../../shared/crimeSchemas.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { crimeType, collectedData = {}, language = 'en', evidence = [] } = body;

    if (!crimeType) {
      return NextResponse.json({ error: 'crimeType is required' }, { status: 400 });
    }

    const complainant = {
      name: collectedData.victim_name || 'Complainant',
      phone: collectedData.victim_phone || '',
      email: collectedData.victim_email || '',
    };

    const incident = {
      date: collectedData.incident_date || new Date().toISOString().split('T')[0],
      description: collectedData.description || 'Cyber incident details provided.',
    };

    const financialLoss = {
      amount: collectedData.amount ? Number(collectedData.amount) : 0,
      transactionId: collectedData.transaction_id || '',
      bankApp: collectedData.bank_app || '',
      scammerContact: collectedData.scammer_info || collectedData.scammer_account_upi || '',
    };

    const formalEnglishText = buildFormalEnglishComplaint({
      crimeType,
      ...collectedData,
      complainant,
      incident,
      financialLoss,
      evidence,
    });

    const translatedText = buildTranslatedComplaint({
      crimeType,
      ...collectedData,
      complainant,
      incident,
      financialLoss,
    }, language);

    const completenessScore = calculateCompleteness(crimeType, collectedData);

    const newRecord = await createComplaintRecord({
      crimeType,
      language,
      complainant,
      incident,
      financialLoss,
      collectedData,
      evidence,
      formalEnglishText,
      translatedText,
      completenessScore,
      status: completenessScore === 100 ? 'ready' : 'draft',
    });

    return NextResponse.json({
      success: true,
      complaint: newRecord,
      message: 'Complaint record successfully registered.',
    });
  } catch (err) {
    console.error('Error creating complaint:', err);
    return NextResponse.json({ error: err.message || 'Failed to create complaint' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const list = await listAllComplaints(25);
    return NextResponse.json({
      success: true,
      complaints: list,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to list complaints' }, { status: 500 });
  }
}
