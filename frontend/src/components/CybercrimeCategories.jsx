import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, UserX, ShieldAlert, Bug, Send, ShoppingBag, 
  Video, Briefcase, ChevronRight, AlertCircle, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

export const CybercrimeCategories = () => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeModalCategory, setActiveModalCategory] = useState(null);

  const categories = [
    {
      id: 'financial',
      filter: 'FINANCIAL',
      title: 'UPI & Banking Fraud',
      severity: 'CRITICAL',
      severityColor: 'text-red-400 bg-red-500/20 border-red-500/40',
      icon: CreditCard,
      description: 'Fraudulent UPI transactions, fake QR codes, ATM skimming, unauthorized net banking debits, and investment ponzi schemes.',
      legalSections: 'IT Act Sec 66C, 66D | IPC Sec 419, 420',
      evidenceNeeded: ['Bank statement (PDF/Screenshot)', 'UPI Reference (UTR Number)', 'Fraudster Account/UPI details', 'SMS Alerts received'],
      immediateAction: 'Call 1930 within 2 hours ("Golden Hour") and ask bank to freeze the beneficiary account.',
    },
    {
      id: 'identity',
      filter: 'PERSONAL',
      title: 'Identity Theft & Impersonation',
      severity: 'HIGH',
      severityColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      icon: UserX,
      description: 'Fake social media accounts pretending to be you, unauthorized loan apps using Aadhaar/PAN, and forged documents.',
      legalSections: 'IT Act Sec 66C | IPC Sec 468, 471',
      evidenceNeeded: ['URL of fake profile', 'Screenshots of impersonator chatting with your contacts', 'Copy of your genuine ID proof'],
      immediateAction: 'Report profile directly to platform trust & safety, notify family/contacts, document profile links.',
    },
    {
      id: 'phishing',
      filter: 'CYBER_ATTACK',
      title: 'Phishing & Malicious Links',
      severity: 'HIGH',
      severityColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      icon: Send,
      description: 'Deceptive SMS/WhatsApp links claiming account suspension, electricity bill cutoff, PAN KYC update, or lottery prizes.',
      legalSections: 'IT Act Sec 66D, 43',
      evidenceNeeded: ['Full SMS/Message screenshot with sender ID', 'Raw website URL', 'Call logs if scammer called you'],
      immediateAction: 'Do not click the link. Disconnect phone from internet if APK was installed. Perform factory reset if needed.',
    },
    {
      id: 'cyberbullying',
      filter: 'PERSONAL',
      title: 'Cyber Harassment & Stalking',
      severity: 'HIGH',
      severityColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      icon: ShieldAlert,
      description: 'Online trolling, abusive messages, persistent stalking, morphing photos, and non-consensual image sharing.',
      legalSections: 'IT Act Sec 66E, 67, 67A | IPC Sec 354D, 507, 509',
      evidenceNeeded: ['Chat transcripts with timestamps', 'Suspect username & profile link', 'Unedited audio/video files'],
      immediateAction: 'Preserve evidence before blocking. Do not delete chat logs. Contact Women Helpline 1091 or Cyber Police.',
    },
    {
      id: 'ransomware',
      filter: 'CYBER_ATTACK',
      title: 'Ransomware & Malware Extortion',
      severity: 'CRITICAL',
      severityColor: 'text-red-400 bg-red-500/20 border-red-500/40',
      icon: Bug,
      description: 'Device locked with encryption demanding cryptocurrency ransom, remote access trojans (RAT), and spyware.',
      legalSections: 'IT Act Sec 43, 66 | IPC Sec 384 (Extortion)',
      evidenceNeeded: ['Ransom note screenshot / text file', 'Sample encrypted file extension', 'Bitcoin wallet address demanded'],
      immediateAction: 'Disconnect infected machine from local network immediately. Do not pay ransom. Contact CERT-In incident response.',
    },
    {
      id: 'ecommerce',
      filter: 'FINANCIAL',
      title: 'E-Commerce & Delivery Fraud',
      severity: 'MEDIUM',
      severityColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      icon: ShoppingBag,
      description: 'Fake shopping portals selling non-existent goods, counterfeit products, fake courier update fees, and refund scams.',
      legalSections: 'Consumer Protection Act | IPC Sec 420',
      evidenceNeeded: ['Order receipt & payment proof', 'Website URL and fake invoice', 'Courier consignment tracking number'],
      immediateAction: 'Contact official payment gateway for chargeback request and dispute transaction.',
    },
    {
      id: 'deepfake',
      filter: 'PERSONAL',
      title: 'Deepfake & AI Voice Impersonation',
      severity: 'CRITICAL',
      severityColor: 'text-red-400 bg-red-500/20 border-red-500/40',
      icon: Video,
      description: 'Synthesized voice clone pretending to be a relative in an emergency distress asking for urgent wire transfer.',
      legalSections: 'IT Act Sec 66D | IPC Sec 419, 420',
      evidenceNeeded: ['Call recording if available', 'WhatsApp audio note file', 'Transaction logs of sent funds'],
      immediateAction: 'Always call back the relative on their known phone line before sending funds. Report voice cloning immediately.',
    },
    {
      id: 'job_scam',
      filter: 'FINANCIAL',
      title: 'Work-From-Home & Task Scams',
      severity: 'HIGH',
      severityColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      icon: Briefcase,
      description: 'Telegram groups promising ₹5,000/day for liking YouTube videos or Google reviews, escalating into crypto deposit traps.',
      legalSections: 'IT Act Sec 66D | IPC Sec 420',
      evidenceNeeded: ['Telegram group link & chat history', 'Screenshots of initial fake payouts', 'Crypto wallet or bank transfer proofs'],
      immediateAction: 'Stop transferring further money to "withdraw profit". File a complaint draft with complete transaction chain.',
    },
  ];

  const filtered = selectedFilter === 'ALL' 
    ? categories 
    : categories.filter(c => c.filter === selectedFilter);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {[
          { label: 'All Cybercrimes', key: 'ALL' },
          { label: 'Financial & Banking', key: 'FINANCIAL' },
          { label: 'Identity & Harassment', key: 'PERSONAL' },
          { label: 'Cyber Attacks & Malware', key: 'CYBER_ATTACK' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
              selectedFilter === tab.key
                ? 'bg-[#E6325B] text-white font-bold shadow-[0_4px_14px_rgba(230,50,91,0.3)]'
                : 'bg-white border border-[#E5E2DE] text-[#0F172A] hover:border-[#E6325B]/40 hover:bg-[#F8F9FA] font-semibold'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(cat => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="group p-6 rounded-2xl bg-white border border-[#E5E2DE] hover:border-[#E6325B]/40 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] border border-[#E5E2DE] flex items-center justify-center text-[#E6325B] group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cat.severityColor}`}>
                    {cat.severity}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-[#E6325B] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#334155] mt-2 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DE] flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#E6325B] font-bold truncate max-w-[150px]">
                  {cat.legalSections.split('|')[0]}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalCategory(cat)}
                  className="flex items-center gap-1 text-xs text-[#0F172A] font-bold hover:text-[#E6325B] transition-colors"
                >
                  <span>Protocol</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal with Complete Investigation Guidance */}
      <AnimatePresence>
        {activeModalCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E5E2DE] p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B]">
                    <activeModalCategory.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">{activeModalCategory.title}</h3>
                    <p className="text-xs font-mono text-[#E6325B] font-semibold">{activeModalCategory.legalSections}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModalCategory(null)}
                  className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  <strong className="block font-mono uppercase mb-1 text-amber-950 font-bold">Emergency First Step:</strong>
                  {activeModalCategory.immediateAction}
                </div>

                <div>
                  <h5 className="text-xs font-mono font-bold uppercase text-[#0F172A] mb-2">
                    Evidence Required for FIR / Complaint:
                  </h5>
                  <ul className="space-y-1.5 text-xs text-[#334155] font-medium">
                    {activeModalCategory.evidenceNeeded.map((ev, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E2DE] flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveModalCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#334155] hover:text-[#0F172A] font-bold"
                >
                  Close
                </button>
                <a
                  href="#start-complaint"
                  onClick={() => setActiveModalCategory(null)}
                  className="px-5 py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(230,50,91,0.3)]"
                >
                  Start This Complaint
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CybercrimeCategories;
