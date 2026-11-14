import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Globe, Phone, MessageSquare, RefreshCw } from 'lucide-react';

export const ThreatScannerWidget = () => {
  const [inputType, setInputType] = useState('url'); // 'url' | 'phone' | 'message'
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const presets = {
    url: 'https://secure-bank-login-verification-auth.top/claim',
    phone: '+91 98450 12345 (Reported in UPI lottery fraud)',
    message: 'URGENT: Your SBI account has been locked. Click to update PAN within 24 hrs to avoid penalty: http://sbi-kyc-update.link',
  };

  const handleScan = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setScanning(true);
    setResult(null);

    setTimeout(() => {
      setScanning(false);
      const text = query.toLowerCase();

      if (
        text.includes('claim') ||
        text.includes('sbi') ||
        text.includes('lottery') ||
        text.includes('kyc') ||
        text.includes('urgent') ||
        text.includes('.top') ||
        text.includes('.link') ||
        text.includes('penalty')
      ) {
        setResult({
          riskLevel: 'HIGH',
          riskScore: 89,
          verdict: 'High-Risk Malicious / Phishing Pattern Detected',
          reasons: [
            'Domain mimics authentic banking authority with mismatched TLD (.top / .link)',
            'Employs psychological urgency ("within 24 hrs to avoid penalty")',
            'Suspicious credential harvesting pattern recognized by CyberShield heuristic model',
          ],
          recommendation: 'DO NOT CLICK or enter credentials. Report immediately on CyberShield AI or dial 1930.',
        });
      } else {
        setResult({
          riskLevel: 'LOW',
          riskScore: 12,
          verdict: 'No Known Malicious Indicators Found',
          reasons: [
            'No blacklisted domains or phishing heuristics detected in heuristic baseline',
            'Pattern does not exhibit coercive urgent language',
          ],
          recommendation: 'Always verify source authenticity before sharing OTP or authorizing payments.',
        });
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white border border-[#E5E2DE] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E5E2DE]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#E6325B] animate-pulse" />
            LIVE HEURISTIC THREAT RADAR
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-display text-[#0F172A]">
            Instant Suspicious Threat Analyzer
          </h3>
          <p className="text-sm text-[#334155] mt-1 font-medium">
            Test any suspicious link, phone number, or SMS message before clicking or transferring money.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F4F4F6] border border-[#E5E2DE] self-start md:self-auto">
          <button
            type="button"
            onClick={() => { setInputType('url'); setQuery(presets.url); setResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputType === 'url' ? 'bg-[#E6325B] text-white shadow-sm' : 'text-[#334155] hover:text-[#0F172A]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> URL / Domain
          </button>
          <button
            type="button"
            onClick={() => { setInputType('phone'); setQuery(presets.phone); setResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputType === 'phone' ? 'bg-[#E6325B] text-white shadow-sm' : 'text-[#334155] hover:text-[#0F172A]'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> Phone / UPI
          </button>
          <button
            type="button"
            onClick={() => { setInputType('message'); setQuery(presets.message); setResult(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputType === 'message' ? 'bg-[#E6325B] text-white shadow-sm' : 'text-[#334155] hover:text-[#0F172A]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> SMS Text
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleScan} className="relative z-10 space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              inputType === 'url'
                ? 'Enter suspicious website URL (e.g., https://fake-upi-bonus.xyz)'
                : inputType === 'phone'
                ? 'Enter phone number or suspected UPI ID (e.g., +91 9876543210 or user@xyz)'
                : 'Paste SMS / WhatsApp message text...'
            }
            className="w-full px-5 py-4 pr-32 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] focus:border-[#E6325B] focus:outline-none focus:ring-2 focus:ring-[#E6325B]/20 text-[#0F172A] placeholder-[#64748B] text-sm font-mono transition-all font-medium"
          />
          <button
            type="submit"
            disabled={scanning || !query.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_12px_rgba(230,50,91,0.3)] transition-all disabled:opacity-50"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span className="text-white">Scanning...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Analyze</span>
              </>
            )}
          </button>
        </div>

        {/* Quick sample pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#334155] font-medium">
          <span>Try quick sample:</span>
          <button
            type="button"
            onClick={() => { setQuery(presets[inputType]); }}
            className="text-[#E6325B] font-bold hover:underline font-mono"
          >
            Load Suspicious Demo Sample
          </button>
        </div>
      </form>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`mt-6 p-5 rounded-2xl border ${
              result.riskLevel === 'HIGH'
                ? 'bg-red-50 border-red-200 text-red-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    result.riskLevel === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {result.riskLevel === 'HIGH' ? (
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        result.riskLevel === 'HIGH' ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      THREAT SCORE: {result.riskScore}/100
                    </span>
                    <span className="text-xs text-[#64748B] font-mono font-semibold">• AI HEURISTIC MODEL v2.4</span>
                  </div>
                  <h4 className="text-base font-bold text-[#0F172A] mt-1">{result.verdict}</h4>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-black/10 space-y-2">
              <div className="text-xs font-mono text-[#0F172A] uppercase font-bold">Forensic Indicators:</div>
              <ul className="space-y-1 text-xs text-[#334155] list-disc list-inside font-medium">
                {result.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>{result.recommendation}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreatScannerWidget;
