import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, Lock, Smartphone, CreditCard, Eye, AlertOctagon, Sparkles } from 'lucide-react';

export const CyberSafetyTips = () => {
  const [checkedItems, setCheckedItems] = useState([0, 1]);

  const checklist = [
    { id: 0, text: 'I never enter my UPI PIN when receiving money or accepting cashback offers.' },
    { id: 1, text: 'I have enabled 2-Factor Authentication (2FA) via Authenticator app on Gmail, WhatsApp, and banking apps.' },
    { id: 2, text: 'I never install AnyDesk, RustDesk, or TeamViewer when instructed by a "bank representative".' },
    { id: 3, text: 'I do not click SMS links claiming electricity disconnection, SIM suspension, or KYC expiry.' },
    { id: 4, text: 'I block and report unknown international WhatsApp video calls from unfamiliar country codes (+92, +84, etc.).' },
    { id: 5, text: 'I have registered and set a SIM lock PIN to prevent unauthorized SIM card swapping.' },
  ];

  const toggleCheck = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const score = Math.round((checkedItems.length / checklist.length) * 100);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 cols: 4 Vital Scam Defense Cards */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: CreditCard,
            color: 'text-amber-800 border-amber-200 bg-amber-50',
            title: 'UPI PIN is for PAYING Only',
            desc: 'Receiving funds or cashbacks NEVER requires entering a UPI PIN. If anyone asks for your PIN to send money, it is 100% fraud.',
          },
          {
            icon: Smartphone,
            color: 'text-[#E6325B] border-[#E6325B]/30 bg-[#FFE8EC]',
            title: 'Remote App Screen Hijack',
            desc: 'Never install AnyDesk or QuickSupport on the instructions of a caller. They mirror your screen and capture OTPs and banking passwords.',
          },
          {
            icon: Lock,
            color: 'text-indigo-800 border-indigo-200 bg-indigo-50',
            title: 'Beware Fake Electricity Bills',
            desc: 'Electricity boards never send individual SMS threatening immediate power cut at night with private phone numbers.',
          },
          {
            icon: Eye,
            color: 'text-purple-800 border-purple-200 bg-purple-50',
            title: 'Digital Arrest Hoax',
            desc: 'Police, CBI, ED, or Customs NEVER place anyone under "Digital Arrest" via Skype or video call. End call immediately and inform local police.',
          },
        ].map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-[#E5E2DE] hover:border-[#E6325B]/40 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 border ${tip.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A] tracking-wide">{tip.title}</h4>
              <p className="text-xs text-[#334155] mt-2 leading-relaxed font-medium">{tip.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Right 5 cols: Interactive Cyber Readiness Checklist */}
      <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E5E2DE] shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5E2DE]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E6325B] font-bold">
              Citizen Self-Defense Radar
            </span>
            <h4 className="text-base font-bold text-[#0F172A] mt-0.5">Your Cyber Hygiene Score</h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-[#E6325B]">{score}%</span>
            <span className="block text-[10px] text-[#64748B] uppercase font-mono font-bold">
              {score >= 80 ? 'Fortified' : score >= 50 ? 'Moderate' : 'Vulnerable'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full bg-[#EAE6E2] mb-5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${
              score >= 80
                ? 'bg-[#10B981]'
                : score >= 50
                ? 'bg-[#F59E0B]'
                : 'bg-[#E6325B]'
            }`}
          />
        </div>

        {/* Interactive Checklist Items */}
        <div className="space-y-2.5">
          {checklist.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-[#FFE8EC] border-[#E6325B]/40 text-[#0F172A] font-semibold'
                    : 'bg-[#F8F9FA] border-[#E5E2DE] text-[#334155] hover:border-[#E6325B]/30 font-medium'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                  isChecked ? 'bg-[#E6325B] border-[#E6325B] text-white' : 'border-[#CBD5E1] bg-white'
                }`}>
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3] text-white" />}
                </div>
                <span className="text-xs leading-snug">{item.text}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-[#E5E2DE] flex items-center justify-between text-xs font-mono text-[#64748B] font-semibold">
          <span>{checkedItems.length} of {checklist.length} verified</span>
          <span className="text-[#E6325B] flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3" /> Stay Vigilant
          </span>
        </div>
      </div>
    </div>
  );
};

export default CyberSafetyTips;
