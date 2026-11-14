import { NextResponse } from 'next/server';
import { getComplaintRecord, updateComplaintRecord } from '@/models/Complaint';
import { buildFormalEnglishComplaint, buildTranslatedComplaint } from '@/services/complaintTextBuilder';
import { calculateCompleteness } from '../../../../../shared/crimeSchemas.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const complaint = await getComplaintRecord(id);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, complaint });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve complaint' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await getComplaintRecord(id);
    if (!existing) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const updatedData = {
      ...existing.collectedData,
      ...(body.collectedData || {}),
    };

    const complainant = {
      name: updatedData.victim_name || existing.complainant?.name,
      phone: updatedData.victim_phone || existing.complainant?.phone,
      email: updatedData.victim_email || existing.complainant?.email,
    };

    const incident = {
      date: updatedData.incident_date || existing.incident?.date,
      description: updatedData.description || existing.incident?.description,
    };

    const financialLoss = {
      amount: updatedData.amount ? Number(updatedData.amount) : existing.financialLoss?.amount,
      transactionId: updatedData.transaction_id || existing.financialLoss?.transactionId,
      bankApp: updatedData.bank_app || existing.financialLoss?.bankApp,
      scammerContact: updatedData.scammer_info || existing.financialLoss?.scammerContact,
    };

    const completenessScore = calculateCompleteness(existing.crimeType, updatedData);

    const formalEnglishText = buildFormalEnglishComplaint({
      crimeType: existing.crimeType,
      ...updatedData,
      complainant,
      incident,
      financialLoss,
      evidence: body.evidence || existing.evidence || [],
    });

    const translatedText = buildTranslatedComplaint({
      crimeType: existing.crimeType,
      ...updatedData,
      complainant,
      incident,
      financialLoss,
    }, body.language || existing.language);

    const updated = await updateComplaintRecord(id, {
      ...body,
      complainant,
      incident,
      financialLoss,
      collectedData: updatedData,
      formalEnglishText,
      translatedText,
      completenessScore,
      acknowledgementNumber: body.acknowledgementNumber !== undefined ? body.acknowledgementNumber : existing.acknowledgementNumber,
      status: body.status || (completenessScore === 100 ? 'ready' : 'draft'),
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}
