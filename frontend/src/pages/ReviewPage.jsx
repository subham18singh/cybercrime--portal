import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Download, FileText, ArrowLeft, Edit3, CheckCircle2, AlertTriangle, 
  Copy, Check, Shield, RotateCcw, Save, MessageSquare, Eye, Sparkles 
} from 'lucide-react';
import apiService from '../services/api';
import { getCrimeSchema, getMissingRequiredFields, calculateCompleteness } from '@shared/crimeSchemas.js';
import { buildFormalEnglishComplaint, buildTranslatedComplaint } from '@shared/complaintTextBuilder.js';
import { generateClientComplaintPDF } from '../services/clientPdf.js';

export const ReviewPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');

  const [activeTab, setActiveTab] = useState('english'); // 'english' | 'translated'
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Initialize complaint immediately (0ms delay) from client storage or create standard template
  const [complaint, setComplaint] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cs_complaint_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        const collected = parsed.collectedData || {};
        const crimeType = parsed.crimeType || 'upi_fraud';
        const lang = parsed.language || 'en';

        return {
          complaintId: `CS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
          crimeType,
          collectedData: collected,
          language: lang,
          formalEnglishText: parsed.formalEnglishText || buildFormalEnglishComplaint({ crimeType, collectedData: collected }),
          translatedText: parsed.translatedText || buildTranslatedComplaint({ crimeType, collectedData: collected }, lang),
          completenessScore: calculateCompleteness(crimeType, collected),
          status: 'ready',
        };
      }
    } catch (e) {}

    // Fallback default draft if user opened /review directly
    const defaultData = {
      victim_name: 'Complainant',
      victim_phone: '9876543210',
      incident_date: new Date().toISOString().split('T')[0],
      amount: 5000,
      bank_app: 'UPI App',
      transaction_id: 'Pending Bank Statement',
      description: 'Incident report prepared via CyberShield AI.',
    };
    return {
      complaintId: `CS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      crimeType: 'upi_fraud',
      collectedData: defaultData,
      language: 'en',
      formalEnglishText: buildFormalEnglishComplaint({ crimeType: 'upi_fraud', collectedData: defaultData }),
      translatedText: buildTranslatedComplaint({ crimeType: 'upi_fraud', collectedData: defaultData }, 'hi'),
      completenessScore: 85,
      status: 'draft',
    };
  });

  // Keep draft text buffer for editing
  const [draftBuffer, setDraftBuffer] = useState(complaint.formalEnglishText);

  useEffect(() => {
    setDraftBuffer(activeTab === 'english' ? complaint.formalEnglishText : complaint.translatedText);
  }, [activeTab, complaint.formalEnglishText, complaint.translatedText]);

  // Sync with backend asynchronously in background (non-blocking)
  useEffect(() => {
    if (!complaint) return;

    apiService.createComplaint({
      crimeType: complaint.crimeType,
      collectedData: complaint.collectedData,
      language: complaint.language,
    })
      .then((res) => {
        if (res && res.complaint && res.complaint.complaintId) {
          setComplaint((prev) => ({
            ...prev,
            complaintId: res.complaint.complaintId,
          }));
        }
      })
      .catch(() => {
        // Backend offline or slow: client draft already generated and interactive
      });
  }, []);

  const schema = getCrimeSchema(complaint.crimeType);
  const missing = getMissingRequiredFields(complaint.crimeType, complaint.collectedData);
  const completeness = calculateCompleteness(complaint.crimeType, complaint.collectedData);

  // Copy plain text
  const handleCopyText = () => {
    const textToCopy = activeTab === 'english' ? complaint.formalEnglishText : complaint.translatedText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download plain text file
  const handleDownloadTxt = () => {
    const textToDownload = activeTab === 'english' ? complaint.formalEnglishText : complaint.translatedText;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberShield_Complaint_${complaint.complaintId}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      window.URL.revokeObjectURL(url);
    }, 500);
  };

  // Download guaranteed genuine PDF (Strict White Background & Black Text)
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const textToExport = activeTab === 'english' ? complaint.formalEnglishText : complaint.translatedText;

      // Synthesize clean A4 PDF document with white background, black text, and standard legal borders
      const pdfBytes = await generateClientComplaintPDF({
        complaintId: complaint.complaintId,
        crimeType: complaint.crimeType,
        collectedData: complaint.collectedData,
        complaintText: textToExport,
        language: complaint.language,
      });

      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CyberShield_Complaint_${complaint.complaintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 500);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('Could not export PDF: ' + (e.message || 'Please check your inputs'));
    } finally {
      setDownloading(false);
    }
  };

  // Save manual edits to the full complaint draft
  const handleSaveFullDraft = () => {
    const updated = {
      ...complaint,
      [activeTab === 'english' ? 'formalEnglishText' : 'translatedText']: draftBuffer,
    };
    setComplaint(updated);
    sessionStorage.setItem('cs_complaint_data', JSON.stringify(updated));
    setIsEditingDraft(false);
  };

  // Reset complaint draft to auto-generated from collected data
  const handleResetToAuto = () => {
    const freshEnglish = buildFormalEnglishComplaint({
      crimeType: complaint.crimeType,
      collectedData: complaint.collectedData,
    });
    const freshTranslated = buildTranslatedComplaint({
      crimeType: complaint.crimeType,
      collectedData: complaint.collectedData,
    }, complaint.language);

    const updated = {
      ...complaint,
      formalEnglishText: freshEnglish,
      translatedText: freshTranslated,
    };
    setComplaint(updated);
    setDraftBuffer(activeTab === 'english' ? freshEnglish : freshTranslated);
    sessionStorage.setItem('cs_complaint_data', JSON.stringify(updated));
    setIsEditingDraft(false);
  };

  // Save single field edit from sidebar
  const handleSaveFieldEdit = () => {
    if (!editingField) return;

    const updatedCollected = {
      ...complaint.collectedData,
      [editingField]: editValue,
    };

    const newEnglish = buildFormalEnglishComplaint({
      crimeType: complaint.crimeType,
      collectedData: updatedCollected,
    });
    const newTranslated = buildTranslatedComplaint({
      crimeType: complaint.crimeType,
      collectedData: updatedCollected,
    }, complaint.language);

    const updated = {
      ...complaint,
      collectedData: updatedCollected,
      formalEnglishText: newEnglish,
      translatedText: newTranslated,
      completenessScore: calculateCompleteness(complaint.crimeType, updatedCollected),
    };

    setComplaint(updated);
    setDraftBuffer(activeTab === 'english' ? newEnglish : newTranslated);
    sessionStorage.setItem('cs_complaint_data', JSON.stringify(updated));

    apiService.updateComplaint(complaint.complaintId, {
      collectedData: updatedCollected,
      language: complaint.language,
    }).catch(() => {});

    setEditingField(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DE]">
        <button
          type="button"
          onClick={() => navigate(`/chat${sessionId ? `?session=${sessionId}` : ''}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E2DE] text-xs font-mono font-bold text-[#0F172A] hover:border-[#E6325B] hover:text-[#E6325B] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Chat</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono text-[#64748B] block font-semibold">Dossier ID</span>
            <span className="text-sm font-bold font-mono text-[#E6325B]">{complaint.complaintId}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Score: {completeness}%</span>
          </div>
        </div>
      </div>

      {/* Missing Fields Warning Banner */}
      {missing.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Missing Required Information ({missing.length} pending)</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Police investigating officers require these specific items to register an official First Information Report (FIR).
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {missing.map((key) => {
              const def = schema.fieldDefinitions[key] || { label: key };
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate(`/chat${sessionId ? `?session=${sessionId}` : ''}`)}
                  className="px-3 py-1.5 rounded-full bg-white border border-amber-300 text-xs text-amber-900 font-mono font-bold flex items-center gap-1.5 hover:bg-amber-100 transition-all shadow-sm"
                >
                  <MessageSquare className="w-3 h-3 text-amber-700" />
                  <span>Fill {def.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Document View (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-[#E5E2DE] shadow-xl overflow-hidden">
          
          {/* Document Header Controls */}
          <div className="p-4 sm:p-5 border-b border-[#E5E2DE] flex flex-wrap items-center justify-between gap-3 bg-[#F8F9FA]">
            {/* Language Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E5E2DE]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('english');
                  setIsEditingDraft(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'english'
                    ? 'bg-[#E6325B] text-white font-bold shadow-sm'
                    : 'text-[#334155] hover:text-[#0F172A] font-medium'
                }`}
              >
                Formal English (Official)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('translated');
                  setIsEditingDraft(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'translated'
                    ? 'bg-[#E6325B] text-white font-bold shadow-sm'
                    : 'text-[#334155] hover:text-[#0F172A] font-medium'
                }`}
              >
                Translated Copy ({complaint.language?.toUpperCase() || 'HI'})
              </button>
            </div>

            {/* In-place Edit & Download Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Toggle In-Place Draft Editor */}
              {isEditingDraft ? (
                <>
                  <button
                    type="button"
                    onClick={handleResetToAuto}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#E5E2DE] text-xs text-[#334155] hover:text-[#0F172A] flex items-center gap-1.5 font-mono font-bold"
                    title="Reset to original generated text"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFullDraft}
                    className="px-4 py-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs uppercase font-mono flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Save Draft</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingDraft(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2DE] text-xs text-[#0F172A] hover:border-[#E6325B] hover:text-[#E6325B] flex items-center gap-1.5 font-mono font-bold transition-colors shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Draft</span>
                </button>
              )}

              {/* Copy Plain Text */}
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2DE] text-xs text-[#0F172A] hover:border-[#E6325B] flex items-center gap-1.5 transition-colors font-bold shadow-sm"
                title="Copy plain text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-mono text-[11px]">{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              {/* Download .txt */}
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#E5E2DE] text-xs text-[#0F172A] hover:border-[#E6325B] flex items-center gap-1.5 transition-colors font-bold shadow-sm"
                title="Download plain text file"
              >
                <FileText className="w-3.5 h-3.5 text-[#E6325B]" />
                <span className="font-mono text-[11px]">.txt</span>
              </button>

              {/* Guaranteed PDF Download */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-5 py-2 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-extrabold text-xs uppercase font-mono flex items-center gap-1.5 shadow-[0_4px_14px_rgba(230,50,91,0.3)] transition-all disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span className="text-white">{downloading ? 'Compiling PDF...' : downloadSuccess ? 'Downloaded!' : 'Download .PDF'}</span>
              </button>
            </div>
          </div>

          {/* Authentic White A4 Legal Paper Container with Black Text on Soft Slate Mat */}
          <div className="p-3 sm:p-6 bg-[#EAE6E2] border-b border-[#E5E2DE] overflow-x-auto flex justify-center">
            <div className="w-full max-w-4xl bg-white text-slate-900 border border-[#D5D0CB] shadow-xl rounded-sm p-6 sm:p-12 font-serif select-text">
              
              {/* Formal Letterhead Emblem Header (Black & White standard legal) */}
              <div className="border-2 border-black p-4 mb-8 text-center space-y-1 bg-white">
                <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-700 uppercase">
                  Government of India • Ministry of Home Affairs Protocol
                </div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-black uppercase tracking-wide">
                  Formal Police Complaint & Investigation Petition
                </h2>
                <div className="text-xs font-bold text-slate-800">
                  NATIONAL CYBER CRIME REPORTING PORTAL (cybercrime.gov.in) & CYBER CRIME POLICE STATION
                </div>
                <div className="text-[11px] font-mono text-slate-600 pt-2 border-t border-slate-300 mt-2 flex flex-wrap justify-between items-center gap-2 px-2">
                  <span>Dossier ID: <strong>{complaint.complaintId}</strong></span>
                  <span>National Helpline: <strong>1930</strong></span>
                  <span>Statutory: <strong>IT Act 2000 & BNS</strong></span>
                </div>
              </div>

              {/* Document Body (In-Place Editor vs Standard Legal View) */}
              {isEditingDraft ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-300 text-xs font-mono text-blue-800 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" />
                      In-Place Editor (Modifications will be exported directly to your PDF)
                    </span>
                    <span className="text-slate-500 text-[11px]">Type freely below</span>
                  </div>
                  <textarea
                    value={draftBuffer}
                    onChange={(e) => setDraftBuffer(e.target.value)}
                    rows={26}
                    className="w-full p-4 rounded bg-slate-50 border-2 border-[#E6325B] text-slate-900 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:bg-white resize-y shadow-inner font-medium"
                    placeholder="Type or customize your cybercrime complaint petition..."
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingDraft(false)}
                      className="px-4 py-2 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300 font-mono text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFullDraft}
                      className="px-5 py-2 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-mono text-xs font-bold uppercase shadow"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs sm:text-[13px] leading-relaxed text-black whitespace-pre-line font-mono font-normal">
                  {activeTab === 'english' ? complaint.formalEnglishText : complaint.translatedText}
                </div>
              )}
            </div>
          </div>

          {/* Persistent Statutory Footer Notice */}
          <div className="p-4 bg-[#F8F9FA] text-[11px] font-mono text-[#334155] leading-relaxed flex items-start gap-2 font-medium border-t border-[#E5E2DE]">
            <Shield className="w-4 h-4 text-[#E6325B] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#0F172A]">STATUTORY POLICE ADVISORY:</strong> This formal complaint petition is drafted under the Information Technology Act 2000 (Sections 43, 66, 66C, 66D) & Bharatiya Nyaya Sanhita (BNS) / IPC 419, 420. Save as <strong>.PDF</strong> and submit at <strong>cybercrime.gov.in</strong> or file in person at your designated Cyber Crime Police Station.
            </span>
          </div>
        </div>

        {/* Right Side: Field Inspector & Quick Edit Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-[#E5E2DE] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DE]">
              <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider">
                Field Inspector
              </h4>
              <span className="text-[10px] text-[#64748B] font-mono font-semibold">Quick Field Edit</span>
            </div>

            <div className="space-y-3">
              {Object.entries(schema.fieldDefinitions).map(([key, field]) => {
                const val = complaint.collectedData[key] || '';
                return (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] hover:border-[#E6325B]/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="truncate">
                      <div className="text-[10px] font-mono text-[#E6325B] font-bold">{field.label}</div>
                      <div className="text-xs font-semibold text-[#0F172A] truncate mt-0.5">
                        {val ? String(val) : <span className="text-[#94A3B8] italic">Not provided</span>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingField(key);
                        setEditValue(val ? String(val) : '');
                      }}
                      className="p-1.5 rounded-lg bg-white border border-[#E5E2DE] text-[#64748B] hover:text-[#E6325B] transition-colors"
                      title="Edit field"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Field Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white border border-[#E5E2DE] space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold font-display text-[#0F172A]">
              Edit {schema.fieldDefinitions[editingField]?.label || editingField}
            </h4>

            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-[#E5E2DE] focus:border-[#E6325B] text-[#0F172A] text-xs font-mono font-medium"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingField(null)}
                className="px-4 py-2 rounded-full text-xs font-mono text-[#64748B] hover:text-[#0F172A] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFieldEdit}
                className="px-5 py-2 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase font-mono shadow-[0_4px_14px_rgba(230,50,91,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
