import { NextResponse } from 'next/server';
import { getComplaintRecord } from '@/models/Complaint';
import { generateComplaintPdfDocument } from '@/services/pdfGenerator';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const complaint = await getComplaintRecord(id);

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const pdfBytes = await generateComplaintPdfDocument(complaint);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CyberShield_Complaint_${id}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    return NextResponse.json({ error: 'Failed to generate PDF document' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  return GET(request, { params });
}
