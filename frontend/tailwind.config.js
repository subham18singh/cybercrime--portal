/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#EAE6E2',        // Dribbble Canvas Warm Sand
          dark: '#F8F9FA',      // Dribbble Inset Surface
          card: '#FFFFFF',      // Dribbble Pure White Card
          cardHover: '#F4F4F6',  // Dribbble Subcard Inset
          cardBorder: '#E5E2DE', // Dribbble Hairline Border
          cyan: '#E6325B',      // Dribbble Vibrant Raspberry/Crimson
          blue: '#111113',      // Dribbble Pitch Obsidian Black
          violet: '#D0244C',    // Dribbble Dark Crimson
          green: '#10B981',     // Dribbble Accent Green
          orange: '#F59E0B',    // Amber Warning
          red: '#E6325B',       // Crimson Danger
          muted: '#334155',     // High-contrast deep slate text
          text: '#0F172A',      // High-contrast pitch black text
        },
        dribbble: {
          canvas: '#EAE6E2',
          card: '#FFFFFF',
          subcard: '#F4F4F6',
          darkcard: '#121214',
          crimson: '#E6325B',
          crimsonHover: '#D0244C',
          crimsonTint: '#FFE8EC',
          border: '#EAEAEA',
          textDark: '#0F172A',
          textMuted: '#334155',
          textLight: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 217, 255, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(54, 123, 255, 0.4)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyber-border': 'inset 0 0 15px rgba(0, 217, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'radar': 'radar 4s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(54, 123, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(54, 123, 255, 0.08) 1px, transparent 1px)',
        'cyber-dots': 'radial-gradient(rgba(0, 217, 255, 0.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
