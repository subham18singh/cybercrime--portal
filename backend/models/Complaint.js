import mongoose from 'mongoose';
import crypto from 'crypto';

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    crimeType: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    complainant: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
    },
    incident: {
      date: { type: String, required: true },
      description: { type: String, required: true },
    },
    financialLoss: {
      amount: { type: Number, default: 0 },
      transactionId: { type: String, default: '' },
      bankApp: { type: String, default: '' },
      scammerContact: { type: String, default: '' },
    },
    accusedDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    collectedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    evidence: [
      {
        filename: String,
        fileType: String,
        fileSize: Number,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'ready', 'submitted_to_police', 'under_review'],
      default: 'ready',
    },
    acknowledgementNumber: {
      type: String,
      default: '',
    },
    formalEnglishText: {
      type: String,
      required: true,
    },
    translatedText: {
      type: String,
      default: '',
    },
    completenessScore: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

export const ComplaintModel =
  mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);

// Memory store fallback for environments without active MongoDB
const inMemoryComplaints = new Map();

export async function createComplaintRecord(data) {
  const complaintId = data.complaintId || `CS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const record = {
    ...data,
    complaintId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryComplaints.set(complaintId, record);

  try {
    const doc = await ComplaintModel.create(record);
    return doc.toObject();
  } catch (err) {
    // If Mongo is unavailable, return memory record
    return record;
  }
}

export async function getComplaintRecord(complaintId) {
  try {
    const doc = await ComplaintModel.findOne({ complaintId });
    if (doc) return doc.toObject();
  } catch (err) {}
  return inMemoryComplaints.get(complaintId) || null;
}

export async function updateComplaintRecord(complaintId, updates) {
  const current = inMemoryComplaints.get(complaintId) || {};
  const updated = {
    ...current,
    ...updates,
    complaintId,
    updatedAt: new Date(),
  };
  inMemoryComplaints.set(complaintId, updated);

  try {
    const doc = await ComplaintModel.findOneAndUpdate(
      { complaintId },
      { $set: updates },
      { new: true }
    );
    if (doc) return doc.toObject();
  } catch (err) {}

  return updated;
}

export async function listAllComplaints(limit = 20) {
  try {
    const docs = await ComplaintModel.find().sort({ createdAt: -1 }).limit(limit);
    if (docs && docs.length > 0) {
      return docs.map((d) => d.toObject());
    }
  } catch (err) {}

  return Array.from(inMemoryComplaints.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}
