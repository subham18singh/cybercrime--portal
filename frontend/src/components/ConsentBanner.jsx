import React from 'react';
import { ShieldCheck, Lock, Trash2, ArrowRight } from 'lucide-react';
import { getUITranslation } from '@shared/translations.js';

export const ConsentBanner = ({ onAccept, onCancel, language = 'en' }) => {
  const ui = getUITranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E5E2DE] p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E5E2DE]">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-[#0F172A]">{ui.consentTitle}</h3>
            <span className="text-xs font-mono text-[#E6325B] font-bold">Zero-Knowledge Legal Privacy Guarantee</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] text-xs text-[#0F172A] leading-relaxed space-y-2 font-medium">
          <p>{ui.consentBody}</p>
          <ul className="list-disc list-inside space-y-1 text-[#334155] pt-2 text-[11px] font-mono font-semibold">
            <li>Strict 24-hour TTL session auto-deletion</li>
            <li>No unredacted bank records stored</li>
            <li>Victim controls full document generation</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {ui.deleteDataNow}
            </button>
          )}

          <button
            type="button"
            onClick={onAccept}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(230,50,91,0.3)] transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-white">{ui.consentAccept}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
