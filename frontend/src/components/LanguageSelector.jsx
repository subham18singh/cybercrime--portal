import React from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@shared/translations.js';

export const LanguageSelector = ({ currentLang = 'auto', onChange }) => {
  return (
    <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E2DE] text-xs text-[#0F172A] hover:border-[#E6325B]/40 transition-all shadow-sm">
      <Globe className="w-3.5 h-3.5 text-[#E6325B] shrink-0" />
      <select
        value={currentLang}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[#0F172A] font-mono text-xs font-bold focus:outline-none cursor-pointer pr-2"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-[#0F172A] font-medium">
            {lang.native} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
