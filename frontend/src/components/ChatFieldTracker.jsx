import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getCrimeSchema } from '@shared/crimeSchemas.js';
import { getUITranslation } from '@shared/translations.js';

export const ChatFieldTracker = ({
  crimeType,
  collectedData = {},
  completeness = 0,
  onReviewClick,
  language = 'en',
}) => {
  const schema = getCrimeSchema(crimeType);
  const ui = getUITranslation(language);
  const requiredFields = schema.requiredFields || [];

  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E2DE] p-4 md:p-5 space-y-4 shadow-sm">
      {/* Header and Score */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DE]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider">
              {ui.fieldTrackerTitle}
            </h4>
            <span className="text-[10px] text-[#E6325B] font-mono font-semibold">
              {schema.displayName}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold font-mono text-[#E6325B]">{completeness}%</span>
          <span className="block text-[9px] text-[#64748B] font-mono uppercase font-semibold">Completeness</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[#EAE6E2] overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            completeness === 100
              ? 'bg-[#10B981]'
              : 'bg-[#E6325B]'
          }`}
          style={{ width: `${completeness}%` }}
        />
      </div>

      {/* Required Fields Checklist */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {requiredFields.map((fieldKey) => {
          const fieldDef = schema.fieldDefinitions[fieldKey] || { label: fieldKey };
          const value = collectedData[fieldKey];
          const isFilled = value !== undefined && value !== null && String(value).trim().length > 0;

          return (
            <div
              key={fieldKey}
              className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                isFilled
                  ? 'bg-emerald-50 border-emerald-200 text-[#0F172A] font-medium'
                  : 'bg-[#F8F9FA] border-[#E5E2DE] text-[#64748B]'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {isFilled ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                )}
                <span className="truncate">{fieldDef.label}</span>
              </div>

              {isFilled && (
                <span className="text-[10px] font-mono text-[#0F172A] font-bold truncate max-w-[120px]">
                  {String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Review Ready Call to Action */}
      {completeness === 100 && (
        <button
          type="button"
          onClick={onReviewClick}
          className="w-full py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(230,50,91,0.3)] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="text-white">{ui.reviewDraftBtn}</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
};

export default ChatFieldTracker;
