import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, PhoneCall, AlertTriangle, Menu, X, Globe, Sparkles, ChevronRight, LayoutDashboard, FolderLock } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('auto');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'AI Investigation Chat', path: '/chat' },
    { name: 'Case Records', path: '/dashboard' },
    { name: 'Evidence Locker', path: '/evidence' },
  ];

  return (
    <>
      {/* Emergency Golden Hour Top Telemetry Strip */}
      <div className="bg-gradient-to-r from-amber-600/90 via-red-600/90 to-amber-600/90 text-white text-xs py-1.5 px-4 font-mono font-medium text-center flex items-center justify-center gap-2 relative z-50 shadow-md">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span>
          <strong>VICTIM OF FINANCIAL FRAUD?</strong> Report within 2 hours on Cyber Helpline <strong>1930</strong> to freeze fraudulent bank transfers.
        </span>
        <a
          href="tel:1930"
          className="ml-2 inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 px-2 py-0.5 rounded text-[11px] font-bold underline"
        >
          <PhoneCall className="w-3 h-3" /> Dial 1930 Now
        </a>
      </div>

      {/* Main Sticky Futuristic Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#E5E2DE] shadow-sm'
            : 'bg-white/80 backdrop-blur-md border-b border-[#E5E2DE]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-[#111113] text-white shadow-md group-hover:scale-105 transition-all">
              <Shield className="w-6 h-6 text-[#E6325B]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-display tracking-tight text-[#0F172A] group-hover:text-[#E6325B] transition-colors">
                  CYBERSHIELD<span className="text-[#E6325B] font-mono text-sm ml-1">AI</span>
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FFE8EC] text-[#E6325B] border border-[#E6325B]/30">
                  HYBRID ENGINE
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] font-mono tracking-wider uppercase">
                FIR & Victim Assistance Command Center
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#E6325B] font-extrabold'
                    : 'text-[#1E293B] hover:text-[#E6325B] font-semibold'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector currentLang={currentLang} onChange={setCurrentLang} />

            {/* Helpline 1930 Pill */}
            <a
              href="tel:1930"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-mono font-semibold transition-all shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>1930 Helpline</span>
            </a>

            {/* Primary Action Button */}
            <Link
              to="/chat"
              className="relative group px-5 py-2 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_14px_rgba(230,50,91,0.35)] hover:shadow-[0_6px_20px_rgba(230,50,91,0.5)] transition-all flex items-center gap-1.5 overflow-hidden"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Complaint</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="tel:1930"
              className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-cyber-card border border-cyber-cardBorder text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cyber-dark/95 border-b border-cyber-cardBorder px-4 pt-3 pb-6 space-y-3 backdrop-blur-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-200 hover:text-cyber-cyan"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-cyber-cardBorder flex flex-col gap-2.5">
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Start AI Complaint Draft
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
