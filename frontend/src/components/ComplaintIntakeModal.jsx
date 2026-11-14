import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, MessageSquare, AlertTriangle, ArrowRight, X, PhoneCall, CheckCircle } from 'lucide-react';

export const ComplaintIntakeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isRecentFinancial, setIsRecentFinancial] = useState(null);
  const [briefSummary, setBriefSummary] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-xl rounded-3xl bg-white border border-[#E5E2DE] p-6 md:p-8 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#E5E2DE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#0F172A]">AI Complaint Initiation</h3>
              <p className="text-xs font-mono text-[#64748B] font-semibold">Step {step} of 3: Incident Triage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8F9FA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 py-6">
          {/* Step 1: Language Preference */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A]">
                Select your preferred language for the AI Assistant:
              </h4>
              <p className="text-xs text-[#334155] font-medium">
                Our Gemini AI engine understands English, Hindi, Punjabi, and all regional languages seamlessly.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { name: 'English', native: 'English', desc: 'Standard Legal Format' },
                  { name: 'Hindi', native: 'हिंदी', desc: 'आसान हिंदी सहायता' },
                  { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', desc: 'ਸੌਖੀ ਪੰਜਾਬੀ ਮਦਦ' },
                ].map((lang) => (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.name)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      selectedLanguage === lang.name
                        ? 'bg-[#FFE8EC] border-[#E6325B] text-[#0F172A] shadow-sm ring-1 ring-[#E6325B]'
                        : 'bg-white border-[#E5E2DE] text-[#334155] hover:border-[#E6325B]/40'
                    }`}
                  >
                    <div className="text-base font-bold font-display text-[#0F172A]">{lang.native}</div>
                    <div className="text-[11px] font-mono mt-0.5 text-[#E6325B] font-bold">{lang.name}</div>
                    <div className="text-[10px] text-[#64748B] mt-1 font-medium">{lang.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_14px_rgba(230,50,91,0.3)] transition-all"
                >
                  <span className="text-white">Continue</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Golden Hour Triage */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-mono font-bold uppercase text-amber-900">
                    Emergency Triage: Golden Hour Check
                  </h5>
                  <p className="text-xs text-amber-800 mt-1 font-medium">
                    Did you lose money from your bank account or UPI in the <strong>last 2 hours</strong>?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecentFinancial(true)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isRecentFinancial === true
                      ? 'bg-red-50 border-red-400 text-red-950 ring-2 ring-red-400'
                      : 'bg-white border-[#E5E2DE] text-[#334155] hover:border-red-300'
                  }`}
                >
                  <div className="text-sm font-bold text-red-700">YES - Within 2 Hours</div>
                  <div className="text-xs text-[#334155] mt-1 font-medium">High urgency fund-freeze required.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRecentFinancial(false)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isRecentFinancial === false
                      ? 'bg-slate-100 border-[#0F172A] text-[#0F172A] ring-2 ring-[#0F172A]'
                      : 'bg-white border-[#E5E2DE] text-[#334155] hover:border-[#0F172A]/40'
                  }`}
                >
                  <div className="text-sm font-bold text-[#0F172A]">NO / Other Cybercrime</div>
                  <div className="text-xs text-[#334155] mt-1 font-medium">Identity, phishing, harassment, etc.</div>
                </button>
              </div>

              {isRecentFinancial === true && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-red-700">
                    <PhoneCall className="w-4 h-4" /> DIAL 1930 IMMEDIATELY
                  </div>
                  <p className="font-medium">
                    Please call <strong>1930</strong> right now to place an urgent lien on the beneficiary account while our AI structures your full written complaint draft.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-mono text-[#64748B] hover:text-[#0F172A] font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isRecentFinancial === null}
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 shadow-sm"
                >
                  <span className="text-white">Next Step</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Brief Description */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A]">
                Briefly describe what happened in your own words:
              </h4>
              <p className="text-xs text-[#334155] font-medium">
                You can write in English, Hindi, Punjabi, or Hinglish. Our AI assistant will analyze and ask you clarifying questions.
              </p>

              <textarea
                rows={4}
                value={briefSummary}
                onChange={(e) => setBriefSummary(e.target.value)}
                placeholder="Example: I got a call claiming to be electricity department officer. They told me power will be cut tonight if I don't pay ₹10 fee via APK link..."
                className="w-full p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] focus:border-[#E6325B] focus:outline-none focus:ring-2 focus:ring-[#E6325B]/20 text-[#0F172A] placeholder-[#64748B] text-xs leading-relaxed font-sans font-medium"
              />

              <div className="p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E5E2DE] flex items-center gap-3 text-xs text-[#334155] font-medium">
                <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>
                  Language selected: <strong className="text-[#0F172A]">{selectedLanguage}</strong> • AI Assistant will initialize investigation session.
                </span>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-mono text-[#64748B] hover:text-[#0F172A] font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const langCode = selectedLanguage === 'Hindi' ? 'hi' : selectedLanguage === 'Punjabi' ? 'pa' : 'en';
                    sessionStorage.setItem('cs_initial_summary', briefSummary);
                    sessionStorage.setItem('cs_initial_lang', langCode);
                    onClose();
                    window.location.href = `/chat?lang=${langCode}`;
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_14px_rgba(230,50,91,0.3)]"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white">Launch AI Investigation</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ComplaintIntakeModal;
