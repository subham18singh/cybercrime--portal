# CYBERSHIELD AI 🛡️
## AI-Powered Cybercrime Complaint & FIR Assistance Portal

> **"Your Digital Safety. Our Intelligent Assistance."**

CYBERSHIELD AI is a modern, full-stack, AI-powered Cybercrime Complaint and Victim Assistance Command Center engineered to bridge the gap between victims of digital fraud and formal law enforcement reporting (1930 Helpline & National Cyber Crime Reporting Portal - cybercrime.gov.in).

---

## 🚀 Key Highlights & Architecture

- **Independent Frontend & Backend Micro-Architecture**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios (Port `5173`).
  - **Backend**: Next.js 14 App Router, REST Route Handlers, MongoDB/Mongoose (with zero-config in-memory fallback), Zod, Groq LLaMA 3.3 / Gemini AI, pdf-lib, Forensic OCR (Port `3000`).
- **Resilient AI Intake Engine**:
  - Ultra-fast conversational extraction across English, Hindi, Punjabi, Bengali, Tamil, Telugu, and Hinglish.
  - Zero-failure fallback: Works out-of-the-box even without external API keys via the deterministic conversational state-machine.
- **Forensic Evidence Locker**:
  - Automated extraction of 12-digit UTR numbers, defrauded amounts, suspect UPI handles, and payment gateway platforms.
  - 1-click **"Auto-Fill Complaint Draft"** integration.
- **Section 65B IT Act Ready**:
  - Instant generation of station-ready FIR complaints and bilingual PDF dossiers with Devanagari font rendering.

---

## 📁 Project Structure

```
cybercrime/
│
├── frontend/                     # React + Vite application (Port 5173)
│   ├── public/                   # SVG icons, stickers, assets
│   ├── src/
│   │   ├── components/           # Investigation pipeline, field tracker, emergency banners
│   │   ├── pages/                # LandingPage, ChatbotPage, EvidencePage, ReviewPage, Dashboard
│   │   ├── layouts/              # Navbar, Footer
│   │   ├── services/             # Axios REST API client & PDF exporter
│   │   ├── styles/               # Global CSS & Tailwind utilities
│   │   └── App.jsx               # Router & routes
│   ├── .env.example              # Frontend environment template
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Next.js 14 App Router server (Port 3000)
│   ├── app/api/                  # REST route handlers (chat, complaint, evidence, health)
│   ├── models/                   # Mongoose schemas & in-memory session cache
│   ├── services/                 # Groq, Gemini, deterministic chatFlow, PDF generator
│   ├── lib/                      # DB connector (with graceful disconnected fallback)
│   ├── tests/                    # 6-part replay & validation test suite
│   ├── .env.example              # Backend environment template
│   └── package.json
│
├── shared/                       # Isomorphic schemas, validators & translations
│   ├── crimeSchemas.js           # 8 statutory cybercrime category schemas
│   ├── translations.js           # Multilingual UI strings
│   ├── indianNumbers.js          # Lakh, crore & Indic digit parser
│   └── validators.js             # Phone, UTR, Date & URL sanitizers
│
├── package.json                  # Root runner scripts
└── README.md
```

---

## ⚡ Clone & Run in 3 Minutes

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/subham18singh/cybercrime--portal.git
cd cybercrime--portal
```

### 3. Install All Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd backend && npm install`, `cd ../frontend && npm install`)*

---

### 4. Setup Environment Variables (Optional)
The system runs completely out-of-the-box with built-in in-memory fallback. To enable live Groq AI inference or MongoDB:

**Backend:**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` with your preferred keys:
- `GROQ_API_KEY`: Get a free key at [console.groq.com](https://console.groq.com/keys)
- `MONGODB_URI`: (Optional, defaults to local or in-memory)

---

### 5. Start Development Servers

Open two terminals or run:

**Terminal 1 — Backend (Port 3000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🧪 Running Automated Tests

CYBERSHIELD includes an automated test suite verifying Indic number parsing (lakh/crore), 20+ multi-turn conversational replay scenarios, and PDF export:

```bash
npm test
```
All tests should pass with `6/6 passed (100%)`.

---

## 🔒 Security & Privacy Notice
- User incident data and chat sessions are encrypted.
- `.env` secret keys and `node_modules` are automatically ignored by `.gitignore` to prevent credential exposure.
