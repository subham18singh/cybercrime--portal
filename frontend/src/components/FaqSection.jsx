import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Does CYBERSHIELD AI automatically file an FIR with the police?',
      a: 'No. Under Indian law (CrPC / BNSS), an official FIR can only be registered by an authorized Police Officer or directly through the Ministry of Home Affairs National Cyber Crime Reporting Portal (cybercrime.gov.in). CYBERSHIELD AI functions as an advanced pre-investigation command assistant: it classifies your incident, extracts critical digital forensic evidence (UTR numbers, IP/URLs, timestamps) via OCR, synthesizes an airtight chronological timeline, and generates a standardized, ready-to-submit formal complaint draft compliant with the IT Act 2000.',
    },
    {
      q: 'What is the "Golden Hour" protocol and why is 1930 so vital?',
      a: 'The "Golden Hour" refers to the first 2 hours immediately following an unauthorized financial cyber debit. When you dial 1930 (or report through our portal), your complaint triggers the Indian Cyber Crime Coordination Centre (I4C) Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS), which alerts the suspect beneficiary bank to freeze the fraud funds in transit before the scammer can withdraw them via ATM or crypto.',
    },
    {
      q: 'Is my uploaded bank statement, ID, and chat screenshot secure?',
      a: 'Yes. CYBERSHIELD AI implements client-side encryption and an automated Personal Data Redactor. Sensitive personal identifiers such as your Aadhaar number, CVV, or non-pertinent account details can be redacted before generating your legal dossier. We adhere strictly to zero-unauthorized telemetry principles.',
    },
    {
      q: 'Can I report in Hindi, Punjabi, or other regional languages?',
      a: 'Yes! Our underlying Gemini AI natural language architecture understands natural complaints narrated in English, Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), Bengali, Marathi, and Hinglish. You can speak or type casually, and the AI translates and formats it into formal English or bilingual legal police drafts.',
    },
    {
      q: 'What should I do once my complaint PDF is generated?',
      a: '1. Print or export the generated PDF dossier.\n2. Submit it online at cybercrime.gov.in under "Report Cyber Crime" -> "Financial Fraud" or "Other Cyber Crime".\n3. Alternatively, carry the printout along with your original bank statement to your nearest Cyber Police Station or local police station.\n4. Save your official Acknowledgement Number in the CYBERSHIELD AI Complaint Tracker.',
    },
    {
      q: 'How does the Evidence OCR feature work?',
      a: 'When you upload screenshots of UPI payment receipts (GPay, PhonePe, Paytm), SMS notifications, or chat logs, our Tesseract OCR engine extracts transaction reference numbers (UTR, TxnID), timestamps, payee VPA addresses, and phone numbers automatically, organizing them into a chronological evidence ledger.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#E6325B]/40 shadow-md ring-1 ring-[#E6325B]/10'
                : 'bg-white border-[#E5E2DE] hover:border-[#E6325B]/30'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 select-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                    isOpen ? 'bg-[#FFE8EC] text-[#E6325B]' : 'bg-[#F8F9FA] text-[#64748B]'
                  }`}
                >
                  0{index + 1}
                </div>
                <h4 className="text-base font-bold text-[#0F172A] tracking-wide">
                  {faq.q}
                </h4>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#E6325B] shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-6 pb-6 pt-3 text-sm text-[#334155] leading-relaxed border-t border-[#E5E2DE] whitespace-pre-line font-medium">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqSection;
