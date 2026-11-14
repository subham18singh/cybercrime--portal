import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    system: 'CYBERSHIELD AI Intelligence Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      ai_engine: 'ready',
      ocr_service: 'ready',
      timeline_synthesizer: 'ready',
      database: 'ready',
    },
  });
}
