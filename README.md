# CYBERSHIELD AI 🛡️
## AI-Powered Cybercrime Complaint & FIR Assistance Portal

"Your Digital Safety. Our Intelligent Assistance."

CYBERSHIELD AI is a modern, full-stack, AI-powered Cybercrime Complaint and Victim Assistance Command Center engineered to bridge the gap between victims of digital fraud and formal law enforcement reporting.

---

## 🚀 Key Highlights & Architecture

- **Independent Frontend & Backend Micro-Architecture**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Axios (Port `5173`).
  - **Backend**: Next.js 14 App Router, REST Route Handlers, MongoDB/Mongoose, Zod, Google Gemini AI, pdf-lib, Tesseract OCR (Port `3000`).
- **Futuristic Visual Design System**:
  - Theme: *"Futuristic Cyber Intelligence + AI Investigation Command Centre"*
  - Cyber midnight palette: `#080D1B`, `#0D1630`, `#121D35`
  - High-voltage accents: `#00D9FF` (Electric Cyan), `#367BFF` (Neon Blue), `#8B5CF6` (Violet), `#22C55E` (Green), `#F59E0B` (Warning)
  - Interactive AI Cyber Orb, live cyber radar grid, illuminated glassmorphism cards, animated scanning HUD.

---

## 📁 Project Structure

```
CyberShield-AI/
│
├── frontend/                     # React + Vite application (Port 5173)
│   ├── public/
│   │   ├── images/               # High-res cybersecurity visual assets
│   │   ├── gifs/                 # Optimized futuristic cyber animations
│   │   ├── stickers/             # Awareness stickers & warning badges
│   │   └── icons/                # High-tech SVG icons & symbols
│   ├── src/
│   │   ├── assets/               # Local styles & illustrations
│   │   ├── components/           # Reusable UI & futuristic cyber components
│   │   ├── pages/                # LandingPage, Dashboard, Chatbot, Evidence, etc.
│   │   ├── layouts/              # Navbar, Footer, MainLayout
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # Authentication & App state
│   │   ├── services/             # Axios REST API client
│   │   ├── styles/               # Global CSS & Tailwind utilities
│   │   └── App.jsx               # Application router & theme provider
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Next.js App Router API server (Port 3000)
│   ├── app/
│   │   └── api/                  # REST route handlers
│   ├── models/                   # Mongoose schemas (User, Complaint, Evidence, etc.)
│   ├── services/                 # AI, OCR, PDF generation, Threat scanners
│   ├── lib/                      # DB connection & helper utilities
│   ├── validators/               # Zod input schemas
│   ├── middleware.js             # CORS & security headers
│   ├── .env.local                # Local environment secrets
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### 1. Start Next.js Backend (Port 3000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:5173** in your browser.
