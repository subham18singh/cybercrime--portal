import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Sparkles, ArrowRight, PhoneCall, AlertTriangle, 
  FileText, CheckCircle2, Lock, Cpu, Globe, Users, Database,
  Search, ShieldAlert, Award, Headphones, ArrowUpRight
} from 'lucide-react';
import CyberShieldHero from '../components/CyberShieldHero';
import CyberOrb from '../components/CyberOrb';
import InvestigationPipeline from '../components/InvestigationPipeline';
import CybercrimeCategories from '../components/CybercrimeCategories';
import ThreatScannerWidget from '../components/ThreatScannerWidget';
import CyberSafetyTips from '../components/CyberSafetyTips';
import FaqSection from '../components/FaqSection';
import ComplaintIntakeModal from '../components/ComplaintIntakeModal';

export const LandingPage = () => {
  const [intakeModalOpen, setIntakeModalOpen] = useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      {/* =========================================================================
          HERO SECTION
         ========================================================================= */}
      <section className="relative min-h-[92vh] flex items-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Call to Action (7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            {/* Live Security Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2DE] shadow-sm text-xs font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-[#E6325B] animate-ping" />
              <span className="text-[#E6325B] font-bold">CYBERSHIELD AI v2.0 PRO</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#0F172A] font-semibold">Govt Format Standard Compliant</span>
            </motion.div>

            {/* Main Brand Title & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#0F172A] leading-[1.1]">
                Your Digital Safety.<br />
                <span className="cyber-gradient-text">Our Intelligent Assistance.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#334155] max-w-2xl leading-relaxed font-medium">
                Autonomous AI investigation command center engineered to assist cybercrime victims. 
                Extract evidence from screenshots with forensic OCR, synthesize chronological timelines, 
                and generate formal FIR-ready complaint drafts for Cyber Police & 1930 Helpline.
              </p>
            </motion.div>

            {/* Key Value Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-mono text-[#0F172A] font-bold"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E6325B]" />
                <span>Multilingual: EN / हिंदी / ਪੰਜਾਬੀ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>100% Free Public Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0F172A]" />
                <span>Zero-Knowledge Encryption</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                type="button"
                onClick={() => setIntakeModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_4px_18px_rgba(230,50,91,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white">Start Your Complaint</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#categories"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#E5E2DE] text-[#0F172A] font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#E6325B]" />
                <span>Explore Cyber Safety</span>
              </a>
            </motion.div>

            {/* Live Metrics Ticker */}
            <div className="pt-6 border-t border-[#E5E2DE] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#0F172A]">1930</div>
                <div className="text-[10px] text-[#334155] uppercase font-mono font-bold">National Helpline</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#E6325B]">&lt; 2 Hrs</div>
                <div className="text-[10px] text-[#334155] uppercase font-mono font-bold">Golden Hour Window</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#10B981]">100%</div>
                <div className="text-[10px] text-[#334155] uppercase font-mono font-bold">CrPC Compliant</div>
              </div>
            </div>
          </div>

          {/* Right Visual: Holographic Cyber Shield & Orbital HUD (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center z-10">
            <CyberShieldHero />
          </div>
        </div>
      </section>

      {/* =========================================================================
          EMERGENCY GOLDEN HOUR DIRECTIVE BANNER
         ========================================================================= */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-6 mb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#121214] dark-card border border-[#26262B] p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#E6325B]/20 border border-[#E6325B]/40 flex items-center justify-center text-[#E6325B] shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E6325B] text-white" style={{ color: '#FFFFFF' }}>
                    CRITICAL ACTION
                  </span>
                  <span className="text-xs font-mono text-[#E6325B] font-bold tracking-wider">CITIZEN FINANCIAL FRAUD PROTOCOL</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-wide leading-snug" style={{ color: '#FFFFFF' }}>
                  Lost money to an unauthorized UPI or net banking transfer?
                </h3>
                <p className="text-xs sm:text-sm font-medium max-w-3xl leading-relaxed" style={{ color: '#E2E8F0' }}>
                  The Indian Cyber Crime Coordination Centre (I4C) operates the <strong className="font-bold" style={{ color: '#FFFFFF' }}>1930 Citizen Helpline</strong>. Calling within the first <strong className="font-bold" style={{ color: '#FFFFFF' }}>2 hours</strong> allows beneficiary banks to immediately freeze fraudulent funds before withdrawal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:1930"
                className="px-6 py-3.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_16px_rgba(230,50,91,0.4)] transition-all"
                style={{ color: '#FFFFFF' }}
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span className="text-white" style={{ color: '#FFFFFF' }}>Call 1930 Helpline</span>
              </a>
              <button
                type="button"
                onClick={() => setIntakeModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-[#202024] hover:bg-[#2A2A30] border border-[#3A3A42] text-white font-bold text-xs uppercase tracking-wider transition-all"
                style={{ color: '#FFFFFF' }}
              >
                Draft Emergency Dossier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: HOW IT WORKS (THE 5-STEP PIPELINE)
         ========================================================================= */}
      <section id="how-it-works" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-cyber-cardBorder/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              INTELLIGENT COMPLAINT SYNTHESIS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              How CYBERSHIELD AI Works
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              From natural conversational reporting to an authoritative, station-ready legal complaint draft in minutes.
            </p>
          </div>

          <InvestigationPipeline />
        </div>
      </section>

      {/* =========================================================================
          SECTION: AI-POWERED FEATURES
         ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-cyber-dark/40 border-t border-cyber-cardBorder/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#E6325B]" />
              NEXT-GEN CYBER FORENSICS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              AI-Powered Victim Support Engine
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              Engineered with modern language models and forensic OCR to turn fragmented victim reports into structured investigation assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'Multilingual AI Chatbot',
                desc: 'Report comfortably in English, Hindi, Punjabi, or Hinglish. AI empathetically guides you through every detail without confusing police jargon.',
                color: 'text-[#E6325B] bg-[#FFE8EC] border-[#E6325B]/30',
              },
              {
                icon: Database,
                title: 'Evidence Intelligence & OCR',
                desc: 'Upload UPI screenshots, bank passbooks, or WhatsApp logs. High-accuracy OCR extracts UTR, transaction IDs, phone numbers, and timestamps.',
                color: 'text-[#0F172A] bg-slate-100 border-slate-300',
              },
              {
                icon: FileText,
                title: 'Chronological Timeline Generator',
                desc: 'Automatically stitches your incident into an unassailable time sequence with linked evidence exhibits for police officers.',
                color: 'text-[#E6325B] bg-[#FFE8EC] border-[#E6325B]/30',
              },
              {
                icon: Search,
                title: 'Suspicious URL & Threat Analyzer',
                desc: 'Live heuristics engine analyzes suspicious websites, SMS messages, and caller identities against cyber threat databases.',
                color: 'text-amber-700 bg-amber-50 border-amber-200',
              },
              {
                icon: Award,
                title: 'Complaint Completeness Score',
                desc: 'Dynamic real-time audit highlighting missing details (e.g. sender VPA, bank statement date) needed for quick police registration.',
                color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
              },
              {
                icon: Lock,
                title: 'Personal Data Redactor',
                desc: 'Automatically sanitizes sensitive personal identifiers (Aadhaar, CVV, unassociated account numbers) before public station filing.',
                color: 'text-[#0F172A] bg-slate-100 border-slate-300',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-[#E5E2DE] hover:border-[#E6325B]/40 shadow-sm transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0F172A]">{feature.title}</h4>
                  <p className="text-xs text-[#334155] leading-relaxed font-medium">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: TYPES OF CYBERCRIME WE ASSIST WITH
         ========================================================================= */}
      <section id="categories" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-cyber-cardBorder/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              CYBERCRIME DIRECTORY
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              Types of Cybercrimes We Assist With
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              Explore incident protocols, statutory legal sections, and the precise evidence needed for each category.
            </p>
          </div>

          <CybercrimeCategories />
        </div>
      </section>

      {/* =========================================================================
          SECTION: LIVE THREAT SCANNER DEMO WIDGET
         ========================================================================= */}
      <section id="threat-radar" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E2DE]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <Search className="w-3.5 h-3.5 text-[#E6325B]" />
              INTERACTIVE THREAT INTELLIGENCE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              Suspicious Threat Scanner
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              Check unverified links, SMS payment requests, or unknown UPI IDs before falling victim to scams.
            </p>
          </div>

          <ThreatScannerWidget />
        </div>
      </section>

      {/* =========================================================================
          SECTION: CYBER SAFETY TIPS & INTERACTIVE HYGIENE SCORE
         ========================================================================= */}
      <section id="awareness" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E2DE]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              PREVENTION IS THE BEST DEFENSE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              Cyber Hygiene & Scam Defense
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              Evaluate your digital hygiene habits and learn vital rules to protect yourself and your family.
            </p>
          </div>

          <CyberSafetyTips />
        </div>
      </section>

      {/* =========================================================================
          SECTION: FREQUENTLY ASKED QUESTIONS
         ========================================================================= */}
      <section id="faq" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-[#E5E2DE]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold">
              <Headphones className="w-3.5 h-3.5 text-[#E6325B]" />
              CLEAR ANSWERS FOR CITIZENS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#0F172A]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#334155] leading-relaxed font-medium">
              Important information regarding legal standing, evidence protection, and the official complaint filing procedure.
            </p>
          </div>

          <FaqSection />
        </div>
      </section>

      {/* =========================================================================
          SECTION: CALL TO ACTION BANNER
         ========================================================================= */}
      <section id="start-complaint" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E5E2DE]">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#121214] dark-card border border-[#232326] p-8 md:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center">
              <CyberOrb size="md" interactive={false} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight" style={{ color: '#FFFFFF' }}>
              Do Not Panic. Take Intelligent Action Now.
            </h2>
            <p className="text-sm leading-relaxed font-medium" style={{ color: '#E2E8F0' }}>
              Whether you lost funds or faced harassment, CYBERSHIELD AI provides the step-by-step guidance, forensic OCR, and legal structure you need to seek justice.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIntakeModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-sm uppercase tracking-wider shadow-[0_4px_18px_rgba(230,50,91,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white">Start Your Complaint Draft</span>
              </button>

              <a
                href="tel:1930"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#202024] hover:bg-[#2A2A30] border border-[#3A3A42] text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#E6325B]" />
                <span className="text-white">Dial 1930 Emergency Helpline</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal */}
      <ComplaintIntakeModal
        isOpen={intakeModalOpen}
        onClose={() => setIntakeModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
