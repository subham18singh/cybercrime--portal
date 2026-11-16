import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { analyzeEvidenceDocument } from '@/services/visionForensics';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.mp3', '.wav', '.m4a', '.ogg'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum permitted limit (15MB).' }, { status: 400 });
    }

    const rawFilename = file.name || 'evidence_file';
    const ext = path.extname(rawFilename).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({
        error: `Unsupported file format (${ext}). Allowed: PNG, JPG, PDF, MP3, WAV, M4A.`,
      }, { status: 400 });
    }

    // Sanitize filename and prevent directory traversal
    const safeBase = path.basename(rawFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const safeFilename = `${safeBase}_${uniqueId}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, safeFilename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    // Perform True Multimodal Vision OCR, Document Classification & Tamper Analysis
    const forensic = await analyzeEvidenceDocument({
      buffer,
      rawFilename,
      mimetype: file.type || `image/${ext.replace('.', '')}`,
    });

    return NextResponse.json({
      success: true,
      file: {
        filename: safeFilename,
        originalName: rawFilename,
        fileType: file.type || ext.replace('.', '').toUpperCase(),
        fileSize: file.size,
        url: `/uploads/${safeFilename}`,
        uploadedAt: new Date().toISOString(),
        forensic,
      },
    });
  } catch (err) {
    console.error('Evidence upload error:', err);
    return NextResponse.json({ error: 'Evidence upload processing failed.' }, { status: 500 });
  }
}
