import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot', 'system'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  crimeType: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: 'en',
  },
  consentGiven: {
    type: Boolean,
    default: false,
  },
  currentPromptField: {
    type: String,
    default: null,
  },
  collectedData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  messages: [ChatMessageSchema],
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24-hour TTL index: automatically deleted by MongoDB
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// In-memory memory store fallback for standalone/offline runs
const inMemorySessions = new Map();

export const ChatSessionModel =
  mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);

export async function getSession(sessionId) {
  try {
    const session = await ChatSessionModel.findOne({ sessionId });
    if (session) {
      return {
        ...session.toObject(),
        collectedData: session.collectedData instanceof Map
          ? Object.fromEntries(session.collectedData)
          : session.collectedData || {},
      };
    }
  } catch (err) {
    // Fall back to memory store
  }
  return inMemorySessions.get(sessionId) || null;
}

export async function saveSession(sessionId, sessionData) {
  const data = {
    ...sessionData,
    sessionId,
    updatedAt: new Date(),
  };

  inMemorySessions.set(sessionId, data);

  try {
    await ChatSessionModel.findOneAndUpdate(
      { sessionId },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    // If Mongo is offline, session is already preserved in inMemorySessions
  }

  return data;
}

export async function deleteSession(sessionId) {
  inMemorySessions.delete(sessionId);
  try {
    await ChatSessionModel.deleteOne({ sessionId });
  } catch (err) {
    // Ignore offline mongo
  }
}
