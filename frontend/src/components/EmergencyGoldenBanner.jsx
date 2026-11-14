import React from 'react';
import { PhoneCall, AlertTriangle, ExternalLink, HeartHandshake, Shield } from 'lucide-react';
import { getUITranslation } from '@shared/translations.js';

export const EmergencyGoldenBanner = ({ crimeType, sensitive = false, language = 'en' }) => {
  const ui = getUITranslation(language);

  if (sensitive) {
    return (
      <div className="w-full p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
            <HeartHandshake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-purple-900 uppercase tracking-wider">
              SAFE INVESTIGATION ENVIRONMENT
            </div>
            <p className="text-xs text-purple-950 mt-0.5 leading-relaxed font-medium">
              {ui.sensitiveAssurance}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:1091"
            className="px-3.5 py-1.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-white" />
            <span className="text-white">Women 1091</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-white border border-purple-200 text-purple-900 hover:bg-purple-100 text-xs font-mono font-bold flex items-center gap-1 transition-all"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-2xl bg-[#121214] dark-card border border-[#26262B] shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E6325B]/20 border border-[#E6325B]/40 flex items-center justify-center text-[#E6325B] shrink-0">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold text-[#E6325B] uppercase tracking-wider">
            {ui.urgent1930Title}
          </div>
          <p className="text-xs text-white mt-0.5 leading-relaxed font-semibold" style={{ color: '#FFFFFF' }}>
            {ui.urgent1930Text}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href="tel:1930"
          className="px-4 py-2 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_14px_rgba(230,50,91,0.4)] transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5 text-white" />
          <span className="text-white">{ui.dial1930}</span>
        </a>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-full bg-[#202024] hover:bg-[#2A2A30] border border-[#3A3A42] text-white text-xs font-mono font-semibold flex items-center gap-1 transition-all"
        >
          <span className="text-white">cybercrime.gov.in</span>
          <ExternalLink className="w-3 h-3 text-white" />
        </a>
      </div>
    </div>
  );
};

export default EmergencyGoldenBanner;
