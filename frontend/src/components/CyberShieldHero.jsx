import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Cpu, Activity, CheckCircle, Zap } from 'lucide-react';

export const CyberShieldHero = () => {
  return (
    <div className="relative w-full max-w-[500px] h-[480px] flex items-center justify-center select-none">
      {/* Outer Rotating Glowing Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[440px] h-[440px] rounded-full border border-cyber-cyan/20 border-dashed"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_12px_#00D9FF]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyber-violet shadow-[0_0_12px_#8B5CF6]" />
      </motion.div>

      {/* Middle Counter-Rotating Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[350px] h-[350px] rounded-full border border-cyber-blue/30"
      >
        <div className="absolute top-4 right-8 w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_#367BFF]" />
        <div className="absolute bottom-4 left-8 w-2 h-2 rounded-full bg-cyber-green shadow-[0_0_8px_#22C55E]" />
      </motion.div>

      {/* Radial Energy Pulsar */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-cyber-cyan/20 via-cyber-blue/15 to-cyber-violet/25 blur-2xl"
      />

      {/* Central Cyber Shield Platform */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Shield Hexagon / Shield Frame */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-48 h-56 flex items-center justify-center rounded-3xl bg-white backdrop-blur-xl border-2 border-[#E6325B]/40 shadow-[0_10px_35px_rgba(230,50,91,0.15)] overflow-hidden"
        >
          {/* Vertical Scanning Laser Line */}
          <motion.div
            animate={{ y: [-110, 120] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6325B] to-transparent shadow-[0_0_15px_#E6325B] z-20 pointer-events-none"
          />

          {/* Grid Background inside shield */}
          <div className="absolute inset-0 bg-cyber-grid-dense opacity-20" />

          {/* Core Shield Icon */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="p-5 rounded-2xl bg-[#FFE8EC] border border-[#E6325B]/30 shadow-inner"
            >
              <Shield className="w-16 h-16 text-[#E6325B]" strokeWidth={1.8} />
            </motion.div>

            {/* Live Core Status */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E5E2DE] text-[11px] font-mono text-[#0F172A] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>AI SENTINEL ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Telemetry Badge 1: 1930 Direct Protocol */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="absolute -left-12 top-10 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5E2DE] shadow-md text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-amber-800 font-bold tracking-wider">Golden Hour 1930</div>
            <div className="text-xs font-bold text-[#0F172A]">Bank Freeze Protocol</div>
          </div>
        </motion.div>

        {/* Floating Telemetry Badge 2: Forensic OCR Vault */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute -right-10 top-16 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5E2DE] shadow-md text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFE8EC] flex items-center justify-center text-[#E6325B]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[#E6325B] font-bold tracking-wider">Evidence OCR</div>
            <div className="text-xs font-bold text-[#0F172A]">UTR & Phone Extraction</div>
          </div>
        </motion.div>

        {/* Floating Telemetry Badge 3: Legal Complaint Format */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute -bottom-6 left-6 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-[#E5E2DE] shadow-md text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-emerald-800 font-bold tracking-wider">FIR & Station Draft</div>
            <div className="text-xs font-bold text-[#0F172A]">CrPC & IT Act Ready</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CyberShieldHero;
