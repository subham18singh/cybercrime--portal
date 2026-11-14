import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Send, Bot, User, Mic, MicOff, RefreshCw, AlertTriangle, 
  Trash2, ArrowRight, Shield, CheckCircle2, Sparkles, PhoneCall 
} from 'lucide-react';
import apiService from '../services/api';
import ConsentBanner from '../components/ConsentBanner';
import EmergencyGoldenBanner from '../components/EmergencyGoldenBanner';
import LanguageSelector from '../components/LanguageSelector';
import ChatFieldTracker from '../components/ChatFieldTracker';
import { getUITranslation } from '@shared/translations.js';
import { CRIME_TYPES, getCrimeSchema } from '@shared/crimeSchemas.js';

export const ChatbotPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Session & Chat State
  const [sessionId, setSessionId] = useState(() => {
    return searchParams.get('session') || sessionStorage.getItem('cs_sessionId') || '';
  });
  const [consentGiven, setConsentGiven] = useState(() => {
    return sessionStorage.getItem('cs_consent') === 'true';
  });
  const [language, setLanguage] = useState('auto');
  const [crimeType, setCrimeType] = useState(null);
  const [collectedData, setCollectedData] = useState({});
  const [currentPromptField, setCurrentPromptField] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [activeEngine, setActiveEngine] = useState('groq');
  const [categoryOptions, setCategoryOptions] = useState(null);
  const [linkedEvidence, setLinkedEvidence] = useState(null);

  // Messages list
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste. I am CyberShield AI, your digital incident assistance specialist. Please describe what happened in your own words in any language (English, Hindi, Punjabi, Bengali, Tamil, etc.).',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);

  const ui = getUITranslation(language);
  const schema = getCrimeSchema(crimeType);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load prefilled forensic evidence if passed from Evidence Locker
  useEffect(() => {
    try {
      const rawEvidence = sessionStorage.getItem('cs_evidence_prefill');
      if (rawEvidence) {
        const parsed = JSON.parse(rawEvidence);
        setLinkedEvidence(parsed);
        setInputText((prev) => {
          if (!prev) {
            return `I was defrauded of ₹${Number(parsed.amount).toLocaleString('en-IN')} via ${parsed.paymentGateway}. The suspect's UPI ID is ${parsed.payeeIdentity} and the transaction reference UTR is ${parsed.utrNumber}. Please prepare my police complaint.`;
          }
          return prev;
        });
      }
    } catch (e) {
      console.error('Evidence prefill parsing error:', e);
    }
  }, []);

  // Resume session if sessionId exists in query or storage
  useEffect(() => {
    if (sessionId) {
      apiService.getChatHistory(sessionId)
        .then((data) => {
          if (data && data.messages) {
            setMessages(data.messages);
            setCrimeType(data.crimeType);
            setCollectedData(data.collectedData || {});
            setCompleteness(data.completeness || 0);
            setCurrentPromptField(data.currentPromptField);
            if (data.language) setLanguage(data.language);
          }
        })
        .catch(() => {
          // New session if not found
        });
    }
  }, [sessionId]);

  // Voice Speech Recognition Setup
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Send message
  const handleSendMessage = async (customMessage = null) => {
    const msgToSend = (customMessage || inputText).trim();
    if (!msgToSend || loading) return;

    if (!consentGiven) {
      alert('Please accept the privacy and consent policy to proceed.');
      return;
    }

    setInputText('');
    setLoading(true);

    // Optimistically append user message
    const newMsg = {
      sender: 'user',
      text: msgToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await apiService.sendChatMessage({
        sessionId,
        message: msgToSend,
        lang: language,
        consent: consentGiven,
      });

      if (res.sessionId && !sessionId) {
        setSessionId(res.sessionId);
        sessionStorage.setItem('cs_sessionId', res.sessionId);
      }

      setCrimeType(res.crimeType);
      setCollectedData(res.collectedData || {});
      setCompleteness(res.completeness || 0);
      setCurrentPromptField(res.currentPromptField);
      setFallbackUsed(Boolean(res.fallbackUsed));
      if (res.engine) setActiveEngine(res.engine);
      setCategoryOptions(res.options || null);
      if (res.language) setLanguage(res.language);

      // Append bot response
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          timestamp: new Date(),
          metadata: { fallbackUsed: res.fallbackUsed },
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Network communication interrupted. Please check your connection and retry.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Delete Data Immediately
  const handleDeleteDataNow = async () => {
    if (!window.confirm('Are you sure you want to delete all session data immediately?')) return;
    try {
      if (sessionId) {
        await fetch(`http://localhost:3000/api/chat?sessionId=${sessionId}`, { method: 'DELETE' });
      }
    } catch (e) {}

    sessionStorage.removeItem('cs_sessionId');
    sessionStorage.removeItem('cs_consent');
    setSessionId('');
    setCollectedData({});
    setCrimeType(null);
    setCompleteness(0);
    setMessages([
      {
        sender: 'bot',
        text: 'All session data has been permanently deleted from server and browser memory.',
        timestamp: new Date(),
      },
    ]);
  };

  // Navigate to review page
  const handleProceedToReview = () => {
    sessionStorage.setItem('cs_complaint_data', JSON.stringify({
      crimeType,
      collectedData,
      language,
      sessionId,
    }));
    navigate(`/review?session=${sessionId}`);
  };

  return (
    <div className="relative min-h-[90vh] py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Consent Modal if not yet accepted */}
      {!consentGiven && (
        <ConsentBanner
          language={language}
          onAccept={() => {
            setConsentGiven(true);
            sessionStorage.setItem('cs_consent', 'true');
          }}
          onCancel={handleDeleteDataNow}
        />
      )}

      {/* Top Banner Area */}
      <div className="space-y-4 mb-6">
        {/* Linked Forensic Evidence Banner */}
        {linkedEvidence && (
          <div className="p-4 rounded-2xl bg-white border border-[#10B981]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Forensic Evidence Linked: {linkedEvidence.filename}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    UTR #{linkedEvidence.utrNumber}
                  </span>
                </div>
                <div className="text-[11px] text-[#475569] mt-0.5 font-medium">
                  Amount: <strong className="text-[#E6325B]">₹{Number(linkedEvidence.amount).toLocaleString('en-IN')}</strong> • Payee: <strong className="text-[#0F172A]">{linkedEvidence.payeeIdentity}</strong> • Platform: <strong className="text-[#0F172A]">{linkedEvidence.paymentGateway}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('cs_evidence_prefill');
                  setLinkedEvidence(null);
                }}
                className="text-[11px] font-mono text-[#94A3B8] hover:text-red-600 px-2 py-1 font-semibold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Emergency Banner (1930 for Financial or Supportive for Sensitive) */}
        {crimeType && (
          <EmergencyGoldenBanner
            crimeType={crimeType}
            sensitive={schema?.sensitive}
            language={language}
          />
        )}

        {/* Offline Fallback Warning Notice */}
        {fallbackUsed && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{ui.offlineFallbackNotice}</span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold text-amber-400">Deterministic Engine</span>
          </div>
        )}
      </div>

      {/* Main Grid: Chat Workspace (8 cols) + Field Checklist (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Interface (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-[#E5E2DE] shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col h-[78vh] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5E2DE] flex items-center justify-between bg-[#F8F9FA]">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B] shadow-sm">
                <Bot className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[#0F172A] flex items-center gap-2">
                  <span>CyberShield AI Assistant</span>
                  {activeEngine === 'groq' && !fallbackUsed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      GROQ AI ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      OFFLINE ENGINE
                    </span>
                  )}
                </h3>
                <p className="text-[11px] font-mono text-[#64748B] font-semibold">
                  {crimeType ? schema.displayName : 'Analyzing incident narrative...'}
                </p>
              </div>
            </div>

            {/* Language Switcher & Controls */}
            <div className="flex items-center gap-2">
              <LanguageSelector currentLang={language} onChange={setLanguage} />
              <button
                type="button"
                onClick={handleDeleteDataNow}
                title="Wipe Data Now"
                className="p-2 rounded-xl bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans bg-white">
            {messages.map((msg, i) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-lg bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B] shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      isBot
                        ? 'bg-[#F4F4F6] border border-[#E5E2DE] text-[#0F172A] font-medium rounded-tl-none'
                        : 'bg-[#121214] text-white font-medium rounded-tr-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {!isBot && (
                    <div className="w-8 h-8 rounded-lg bg-[#121214] border border-[#232326] flex items-center justify-center text-white shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#E6325B] p-2 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>AI analyzing incident context and extracting evidence fields...</span>
              </div>
            )}

            {/* Crime Category Buttons if LLM cannot infer */}
            {categoryOptions && (
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] space-y-3">
                <p className="text-xs font-mono text-[#E6325B] font-bold">Please select the matching category:</p>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSendMessage(opt.label)}
                      className="p-2.5 rounded-xl bg-white border border-[#E5E2DE] hover:border-[#E6325B] text-left text-xs text-[#0F172A] font-semibold transition-all shadow-sm"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helper Pill */}
          <div className="px-4 py-2 bg-[#F8F9FA] border-t border-[#E5E2DE] text-[11px] font-mono text-[#64748B] font-semibold flex items-center justify-between">
            <span>{ui.skipNotice}</span>
            <span>Indian number formats (e.g. 2 lakh, 1,50,000) accepted</span>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-[#F8F9FA] border-t border-[#E5E2DE] flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-3 rounded-2xl border transition-all ${
                isListening
                  ? 'bg-red-50 border-red-500 text-red-600 animate-pulse'
                  : 'bg-white border-[#E5E2DE] text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Speak message"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={ui.inputPlaceholder}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#E5E2DE] focus:border-[#E6325B] focus:outline-none focus:ring-1 focus:ring-[#E6325B] text-[#0F172A] text-xs sm:text-sm placeholder-[#94A3B8] font-medium"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-6 py-3 rounded-2xl bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_14px_rgba(230,50,91,0.3)] disabled:opacity-40 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline text-white">Send</span>
            </button>
          </form>
        </div>

        {/* Right Sidebar: Real-Time Field Tracker & Ready Review (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ChatFieldTracker
            crimeType={crimeType}
            collectedData={collectedData}
            completeness={completeness}
            onReviewClick={handleProceedToReview}
            language={language}
          />

          {/* Quick Review Action */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E2DE] space-y-3 shadow-sm">
            <h5 className="text-xs font-mono font-bold uppercase text-[#0F172A] flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#E6325B]" />
              <span>Dossier Generation</span>
            </h5>
            <p className="text-[11px] text-[#334155] leading-relaxed font-medium">
              Once required fields are collected, you can inspect the formal CrPC petition draft, edit any field, or export with official watermark.
            </p>
            <button
              type="button"
              onClick={handleProceedToReview}
              className="w-full py-2.5 rounded-full bg-[#121214] hover:bg-black text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors font-semibold"
            >
              <span>View Current Draft</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
