import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

export const CyberOrb = ({ size = 'md', interactive = true, active = true, onClick }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  }[size] || 'w-20 h-20';

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center cursor-pointer select-none group ${sizeClasses}`}
    >
      {/* Outer Atmospheric Aura */}
      <motion.div
        animate={{
          scale: active ? [1, 1.25, 1] : 1,
          opacity: active ? [0.4, 0.8, 0.4] : 0.2,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet blur-xl"
      />

      {/* Cybernetic Rotating Gyro Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute -inset-2 rounded-full border border-cyber-cyan/40 border-dashed"
      />

      {/* Inner Glowing Plasma Sphere */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyber-dark via-cyber-card to-[#051124] border-2 border-cyber-cyan/60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,217,255,0.6)] overflow-hidden">
        {/* Core Shimmer Waves */}
        <motion.div
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/20 to-transparent pointer-events-none"
        />

        {/* AI Icon in center */}
        <Bot className="w-1/2 h-1/2 text-cyber-cyan drop-shadow-[0_0_8px_#00D9FF] group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Floating Sparkle Badge */}
      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center text-cyber-cyan">
        <Sparkles className="w-3 h-3 animate-pulse" />
      </div>
    </div>
  );
};

export default CyberOrb;
