import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, ScanText, Clock, FileCheck2, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export const InvestigationPipeline = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Conversational AI Intake',
      subtitle: 'Natural language in English, Hindi & Punjabi',
      icon: MessageSquareText,
      detail:
        'Victims explain the incident naturally via text or voice. Our AI assistant empathetically extracts dates, loss amounts, and fraudster communication details without intimidating legal jargon.',
      techBadge: 'Gemini 2.0 Multilingual NLP',
    },
    {
      num: '02',
      title: 'Forensic Evidence OCR Vault',
      subtitle: 'Automated Extraction of UTR & Phone numbers',
      icon: ScanText,
      detail:
        'Upload screenshots of UPI transactions (GPay/PhonePe), SMS alerts, or WhatsApp chats. The Tesseract OCR engine extracts transaction reference numbers, beneficiary bank details, and timestamps.',
      techBadge: 'Tesseract OCR + Data Redaction',
    },
    {
      num: '03',
      title: 'Incident Timeline Synthesis',
      subtitle: 'Chronological reconstruction of events',
      icon: Clock,
      detail:
        'Disjointed events are aligned into a structured forensic timeline: first contact, deception, payment authorization, and discovery of fraud, cross-referenced with uploaded exhibits.',
      techBadge: 'Temporal Event Synthesizer',
    },
    {
      num: '04',
      title: 'Legal Classification & Completeness',
      subtitle: 'Mapped to IT Act 2000 & IPC/BNS',
      icon: FileCheck2,
      detail:
        'The engine maps the crime to statutory penal sections (IT Act 66C/66D, IPC 420) and computes a Completeness Score (0-100%), highlighting any missing information needed by investigating officers.',
      techBadge: 'CrPC / Statutory Mapper',
    },
    {
      num: '05',
      title: 'Formal Police & 1930 Dossier',
      subtitle: 'Printable FIR-ready PDF and Ack Tracker',
      icon: Download,
      detail:
        'Generates an official complaint document formatted for direct upload to cybercrime.gov.in or in-person submission at any Cyber Police Station, complete with an acknowledgement tracking record.',
      techBadge: 'pdf-lib Document Generator',
    },
  ];

  return (
    <div className="w-full">
      {/* Horizontal Step Tabs for Desktop */}
      <div className="hidden lg:grid grid-cols-5 gap-3 mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-white border-[#E6325B] shadow-[0_4px_16px_rgba(230,50,91,0.15)] ring-2 ring-[#E6325B]/20'
                  : 'bg-white border-[#E5E2DE] hover:border-[#E6325B]/40 shadow-sm'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#E6325B]" />
              )}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: isActive ? '#E6325B' : '#334155' }}
                >
                  PHASE {step.num}
                </span>
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? '#E6325B' : '#334155' }}
                />
              </div>
              <div
                className="text-xs font-extrabold text-[#0F172A] leading-snug tracking-tight"
                style={{ color: '#0F172A' }}
              >
                {step.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Feature Showcase Card */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 md:p-8 rounded-3xl bg-white border border-[#E5E2DE] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#E6325B] animate-pulse" />
              {steps[activeStep].techBadge}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold font-display text-[#0F172A]">
              {steps[activeStep].title}
            </h3>

            <p className="text-sm font-semibold text-[#E6325B] font-mono">
              {steps[activeStep].subtitle}
            </p>

            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              {steps[activeStep].detail}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121214] hover:bg-black text-xs font-mono text-white transition-all shadow-sm"
              >
                <span>Next Pipeline Phase</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Visual Simulation HUD */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] font-mono text-xs text-[#334155] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E2DE]">
              <span className="text-[#0F172A] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" /> PIPELINE TELEMETRY
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold">STEP {activeStep + 1} / 5</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#E5E2DE]">
                <span>Input Interface:</span>
                <span className="text-[#0F172A] font-bold">Multilingual Webhook / Voice</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E2DE]">
                <span>OCR Target Fields:</span>
                <span className="text-[#0F172A] font-bold">UTR, VPA, Timestamps, Bank</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5E2DE]">
                <span>Statutory Output:</span>
                <span className="text-[#E6325B] font-bold">CrPC Compliant FIR Draft</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Data Privacy:</span>
                <span className="text-[#10B981] font-bold">AES-256 Vault Encryption</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#E5E2DE] text-[10px] text-[#E6325B] font-semibold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#E6325B] animate-ping" />
              <span>Real-time forensic integrity checks active</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestigationPipeline;
