import React from 'react';
import { Shield, ExternalLink, Lock, PhoneCall, AlertTriangle, FileText, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative bg-white border-t border-[#E5E2DE] pt-16 pb-12 overflow-hidden z-10 text-[#0F172A]">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#E6325B]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E5E2DE]">
          {/* Col 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111113] border border-[#232326] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#E6325B]" />
              </div>
              <span className="text-xl font-bold font-display text-[#0F172A]">
                CYBERSHIELD <span className="text-[#E6325B] font-mono">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#334155] max-w-sm leading-relaxed font-medium">
              Autonomous AI investigation command center empowering citizens to report, document, and recover from cybercrimes with forensic precision.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E5E2DE] text-[11px] font-mono text-[#0F172A] font-bold">
                <Lock className="w-3 h-3 text-[#E6325B]" /> End-to-End Vault Encryption
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E5E2DE] text-[11px] font-mono text-[#10B981] font-bold">
                <Shield className="w-3 h-3" /> IT Act 2000 Ready
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-4">
              Intelligence System
            </h4>
            <ul className="space-y-2.5 text-sm text-[#334155] font-medium">
              <li>
                <a href="#how-it-works" className="hover:text-[#E6325B] transition-colors">
                  AI Complaint Pipeline
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#E6325B] transition-colors">
                  Cybercrime Directory
                </a>
              </li>
              <li>
                <a href="#threat-radar" className="hover:text-[#E6325B] transition-colors">
                  Suspicious Threat Scanner
                </a>
              </li>
              <li>
                <a href="#awareness" className="hover:text-[#E6325B] transition-colors">
                  Awareness & Safety Hub
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#E6325B] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Government Portals */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-4">
              Official Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-[#334155] font-medium">
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E6325B] transition-colors"
                >
                  cybercrime.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cert-in.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E6325B] transition-colors"
                >
                  CERT-In Security <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sancharsaathi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E6325B] transition-colors"
                >
                  Sanchar Saathi (CEIR) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://sachet.rbi.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#E6325B] transition-colors"
                >
                  RBI Sachet Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Emergency Hotlines */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-4">
              24/7 Helplines
            </h4>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-mono text-amber-900 font-bold uppercase">Financial Cyber Fraud</div>
                <div className="text-lg font-extrabold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-4 h-4 text-[#E6325B]" /> 1930
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE]">
                <div className="text-[10px] font-mono text-[#64748B] font-bold uppercase">National Emergency</div>
                <div className="text-base font-bold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                  <PhoneCall className="w-4 h-4 text-[#0F172A]" /> 112
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="my-8 p-5 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] text-xs text-[#334155] leading-relaxed font-medium">
          <div className="flex items-center gap-2 font-mono font-bold text-amber-900 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            Official Legal Disclaimer & Scope of Operations
          </div>
          <p>
            CYBERSHIELD AI is an independent artificial intelligence assistance platform engineered to guide victims in identifying fraud typologies, performing OCR on transactional evidence, organizing incident chronology, and generating standardized complaint documentation. 
            <strong className="text-[#0F172A]"> CYBERSHIELD AI does not register statutory First Information Reports (FIRs) directly.</strong> 
            All generated documentation is formatted for victim submission to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or jurisdictional police stations under the Information Technology Act, 2000 and the Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code (IPC).
          </p>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#334155] font-semibold">
          <div>
            &copy; 2026 CYBERSHIELD AI
          </div>
          <div className="flex items-center gap-6">
            <span>Security Rating: AAA+</span>
            <span>Zero-Knowledge Evidence Redaction</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
