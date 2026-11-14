import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import CyberGridBackground from './components/CyberGridBackground';
import LandingPage from './pages/LandingPage';
import ChatbotPage from './pages/ChatbotPage';
import ReviewPage from './pages/ReviewPage';
import DashboardPage from './pages/DashboardPage';
import EvidencePage from './pages/EvidencePage';

function AppContent() {
  const location = useLocation();
  // Do not render the large landing page footer in focused application workspaces like /chat and /review
  const hideFooter = location.pathname === '/chat' || location.pathname === '/review';

  return (
    <div className="relative min-h-screen bg-cyber-bg text-cyber-text flex flex-col selection:bg-cyber-cyan selection:text-cyber-bg">
      {/* Continuous Dynamic Particle Grid & Ambient Cyber Glow */}
      <CyberGridBackground />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Global Footer (Rendered only on landing and informational pages) */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
