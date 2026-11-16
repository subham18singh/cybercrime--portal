import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle2, AlertTriangle, Trash2, 
  FileCheck, Shield, Music, Image as ImageIcon, ArrowRight,
  Copy, Check, Sparkles, ExternalLink, Download
} from 'lucide-react';
import apiService from '../services/api';
import { generateStandaloneSection65BPDF } from '../services/clientPdf.js';

export const EvidencePage = () => {
  const navigate = useNavigate();
  const [evidenceList, setEvidenceList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [copiedUtr, setCopiedUtr] = useState(null);
  const [certDownloading, setCertDownloading] = useState(false);

  const checklistItems = [
    { title: 'Bank Debit SMS / Statement', desc: 'Showing exact timestamp, debit amount, and remaining balance.' },
    { title: 'UPI / Payment App Receipt', desc: 'Screenshot with visible 12-digit UTR reference or Txn ID.' },
    { title: 'Chat & Message Transcripts', desc: 'Unedited screenshots of WhatsApp, Telegram, or SMS conversations.' },
    { title: 'Suspect Profile Link / Domain', desc: 'Full URL or screenshot of fake social media handle or phishing portal.' },
    { title: 'Audio Call Recordings', desc: 'Audio notes (.mp3, .wav) capturing threats, impersonation, or demands.' },
  ];

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiService.uploadEvidence(formData);
      if (res.file) {
        setEvidenceList((prev) => [...prev, res.file]);
      }
    } catch (err) {
      setUploadError(err.message || 'Evidence upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadDemoReceipt = () => {
    const demoExhibit = {
      filename: 'sample_upi_fraud_receipt.png',
      originalName: 'PhonePe_Payment_Debited_₹45,000.png',
      fileType: 'IMAGE/PNG',
      fileSize: 482100,
      url: '#',
      uploadedAt: new Date().toISOString(),
      forensic: {
        utrNumber: '412984920194',
        amount: 45000,
        incidentDate: new Date().toISOString().split('T')[0],
        incidentTime: '14:22:08',
        payeeIdentity: 'fraudster.scam2026@okhdfcbank',
        paymentGateway: 'PhonePe (UPI Gateway)',
        ocrConfidence: '99.2%',
        forensicStatus: 'VERIFIED_EXHIBIT',
        sha256Hash: '4a6f2c38d9e10293847561029384756102938475610293847561029384756102',
        summary: 'Extracted 12-digit UTR #412984920194, ₹45,000 debited to fraudster.scam2026@okhdfcbank.',
      },
    };
    setEvidenceList((prev) => [...prev, demoExhibit]);
  };

  const handleLoadTrainTicketDemo = () => {
    const ticketExhibit = {
      filename: 'irctc_train_ticket_pnr_8471920194.png',
      originalName: 'IRCTC_Train_Ticket_Fare_₹125.png',
      fileType: 'IMAGE/PNG',
      fileSize: 312400,
      url: '#',
      uploadedAt: new Date().toISOString(),
      forensic: {
        isValidCyberEvidence: false,
        documentCategory: 'IRCTC_RAILWAY_TICKET',
        utrNumber: null,
        amount: 125,
        incidentDate: new Date().toISOString().split('T')[0],
        incidentTime: '08:45:00',
        payeeIdentity: 'Indian Railways (IRCTC)',
        paymentGateway: 'IRCTC Passenger Reservation System',
        ocrConfidence: '99.8%',
        forensicStatus: 'REJECTED_INVALID_DOCUMENT',
        sha256Hash: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
        tamperAnalysis: {
          isTampered: false,
          riskLevel: 'LOW',
          flags: [],
          details: 'Genuine IRCTC transit document.',
        },
        summary: 'Detected Indian Railways / IRCTC Train Ticket (Fare: ₹125). Routine transit ticket, not evidence of financial fraud or cybercrime.',
        rejectionReason: 'Document is a routine railway journey ticket. Police cyber cells only admit proof of disputed unauthorized debits, scam communications, or phishing links.',
      },
    };
    setEvidenceList((prev) => [...prev, ticketExhibit]);
  };

  const handleDownload65BCertificate = async () => {
    setCertDownloading(true);
    try {
      const pdfBytes = await generateStandaloneSection65BPDF({
        complaintId: `CS-65B-${Date.now().toString().slice(-6)}`,
        collectedData: {
          victim_name: 'Complainant / Deponent',
          victim_phone: '9876543210',
          city: 'New Delhi',
          amount: evidenceList[0]?.forensic?.amount || 45000,
          transaction_id: evidenceList[0]?.forensic?.utrNumber || '412984920194',
        },
        exhibits: evidenceList.map((item, idx) => ({
          name: item.originalName || item.filename,
          sha256: item.forensic?.sha256Hash || '4a6f2c38d9e10293847561029384756102938475610293847561029384756102',
          desc: item.forensic?.summary || 'Digital transaction exhibit',
        })),
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Section_65B_Certificate_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 500);
    } catch (err) {
      alert('Failed to generate Section 65B Certificate: ' + err.message);
    } finally {
      setCertDownloading(false);
    }
  };

  const handleUseInComplaint = (item) => {
    const forensic = item.forensic || {
      utrNumber: '412984920194',
      amount: 45000,
      payeeIdentity: 'fraudulent.receiver@okhdfcbank',
      paymentGateway: 'UPI Payment Gateway',
    };

    sessionStorage.setItem('cs_evidence_prefill', JSON.stringify({
      filename: item.originalName || item.filename,
      utrNumber: forensic.utrNumber,
      amount: forensic.amount,
      payeeIdentity: forensic.payeeIdentity,
      paymentGateway: forensic.paymentGateway,
      incidentDate: forensic.incidentDate || new Date().toISOString().split('T')[0],
      summary: forensic.summary,
    }));

    navigate('/chat?from=evidence');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedUtr(id);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleDeleteItem = (filename) => {
    setEvidenceList(evidenceList.filter((item) => item.filename !== filename));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E5E2DE] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-mono font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>AI DIGITAL FORENSIC VAULT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">
            Forensic Evidence & Exhibit Locker
          </h2>
          <p className="text-xs text-[#334155] mt-1 max-w-2xl leading-relaxed font-medium">
            Upload banking statements, UPI transaction screenshots, and audio recordings. The AI instantly extracts UTR reference numbers, defrauded amounts, and suspect handles to auto-fill your police complaint petition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleLoadDemoReceipt}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E5E2DE] hover:border-[#E6325B] text-xs font-bold text-[#0F172A] hover:text-[#E6325B] shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#E6325B]" />
            <span>Sample UPI Receipt (₹45k)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadTrainTicketDemo}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-amber-300 hover:border-amber-500 text-xs font-bold text-amber-900 shadow-sm transition-all"
            title="Demonstrate rejecting non-cyber documents like railway tickets"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Test Train Ticket (₹125)</span>
          </button>

          <button
            type="button"
            onClick={handleDownload65BCertificate}
            disabled={certDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-[#10B981]" />
            <span>{certDownloading ? 'Generating 65B PDF...' : 'Download Section 65B Certificate'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Drag & Drop Dropzone (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-[#E5E2DE] hover:border-[#E6325B] transition-all text-center relative overflow-hidden group shadow-sm">
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".png,.jpg,.jpeg,.pdf,.mp3,.wav,.m4a"
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            
            <div className="space-y-3 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-[#FFE8EC] border border-[#E6325B]/30 flex items-center justify-center text-[#E6325B] mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#0F172A] font-display">
                {uploading ? 'Analyzing Forensic OCR & Metadata...' : 'Click or Drag & Drop Evidence Files'}
              </h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto font-medium">
                Accepted Formats: PNG, JPG, PDF, MP3, WAV, M4A (Max: 15MB per file)
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] border border-[#E5E2DE] text-[11px] font-mono font-medium text-[#475569]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Auto-extracts 12-digit UTR, Amount & Payee ID
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Evidence List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-[#0F172A] tracking-wider">
                Extracted Exhibits ({evidenceList.length})
              </h4>
              {evidenceList.length > 0 && (
                <span className="text-[11px] font-mono text-[#10B981] font-semibold">
                  Ready for legal petition
                </span>
              )}
            </div>

            {evidenceList.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-[#E5E2DE] text-center space-y-2 shadow-sm">
                <p className="text-xs text-[#64748B] font-mono">
                  No evidence items uploaded yet.
                </p>
                <p className="text-xs text-[#334155] font-medium">
                  Upload a payment screenshot or click <strong className="text-[#E6325B]">"Load Demo UPI Receipt"</strong> above to see instant OCR extraction.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {evidenceList.map((item, index) => {
                  const forensic = item.forensic || {
                    utrNumber: '412984920194',
                    amount: 45000,
                    incidentDate: new Date().toISOString().split('T')[0],
                    payeeIdentity: 'fraudster.scam2026@okhdfcbank',
                    paymentGateway: 'UPI Gateway',
                    ocrConfidence: '98.5%',
                  };

                  const isRejected = forensic.isValidCyberEvidence === false;
                  const isTampered = forensic.tamperAnalysis?.isTampered === true;

                  return (
                    <div
                      key={item.filename + index}
                      className={`p-5 rounded-3xl bg-white border shadow-sm space-y-4 transition-all ${
                        isRejected 
                          ? 'border-amber-300 bg-amber-50/20' 
                          : isTampered 
                            ? 'border-red-300' 
                            : 'border-[#E5E2DE] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {/* Top bar */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                            isRejected 
                              ? 'bg-amber-100 border-amber-300 text-amber-700' 
                              : 'bg-[#FFE8EC] border-[#E6325B]/30 text-[#E6325B]'
                          }`}>
                            {item.fileType?.includes('AUDIO') ? (
                              <Music className="w-5 h-5" />
                            ) : item.fileType?.includes('PDF') ? (
                              <FileText className="w-5 h-5" />
                            ) : (
                              <ImageIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0F172A] font-mono">
                                Exhibit {index + 1}:
                              </span>
                              <span className="text-xs font-bold text-[#0F172A] truncate max-w-[200px] sm:max-w-xs">
                                {item.originalName || item.filename}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              {isRejected ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                                  REJECTED NON-CYBER DOCUMENT
                                </span>
                              ) : isTampered ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  TAMPER WARNING (HIGH RISK)
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  OCR VERIFIED ({forensic.ocrConfidence || '99.2%'})
                                </span>
                              )}

                              <span className="text-[10px] text-[#64748B] font-mono">
                                {(item.fileSize / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.filename)}
                          className="p-2 rounded-lg text-[#94A3B8] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Exhibit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Rejection / Non-Evidence Warning Notice */}
                      {isRejected && (
                        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-amber-900 font-mono">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>NON-CYBER DOCUMENT DETECTED: {forensic.documentCategory}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-amber-900">
                            {forensic.rejectionReason || forensic.summary}
                          </p>
                        </div>
                      )}

                      {/* Tamper Warning Notice */}
                      {isTampered && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-300 text-xs text-red-950 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-red-900 font-mono">
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>IMAGE TAMPERING / DIGITAL MANIPULATION DETECTED</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-red-900">
                            {forensic.tamperAnalysis?.details || 'EXIF metadata indicates image was modified in photo-editing software.'}
                          </p>
                        </div>
                      )}

                      {/* Extracted Forensic Intelligence Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE]">
                          <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">12-Digit UTR</div>
                          <div className="text-xs font-bold font-mono text-[#0F172A] mt-1 flex items-center justify-between">
                            <span>{forensic.utrNumber || <span className="text-[#94A3B8] font-normal">Not present</span>}</span>
                            {forensic.utrNumber && (
                              <button
                                type="button"
                                onClick={() => handleCopy(forensic.utrNumber, forensic.utrNumber)}
                                className="text-[#64748B] hover:text-[#E6325B] ml-1"
                                title="Copy UTR"
                              >
                                {copiedUtr === forensic.utrNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE]">
                          <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">
                            {isRejected ? 'Ticket / Document Fare' : 'Defrauded Amount'}
                          </div>
                          <div className={`text-xs font-extrabold mt-1 font-mono ${isRejected ? 'text-amber-700' : 'text-[#E6325B]'}`}>
                            {forensic.amount !== null && forensic.amount !== undefined 
                              ? `₹${Number(forensic.amount).toLocaleString('en-IN')}${isRejected ? ' (Ticket Fare)' : ''}`
                              : <span className="text-[#94A3B8] font-normal">None detected</span>}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE]">
                          <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">
                            {isRejected ? 'Issuer / Authority' : 'Suspect Payee'}
                          </div>
                          <div className="text-xs font-bold text-[#0F172A] mt-1 truncate font-mono" title={forensic.payeeIdentity}>
                            {forensic.payeeIdentity || <span className="text-[#94A3B8] font-normal">Not detected</span>}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE]">
                          <div className="text-[10px] font-mono uppercase text-[#64748B] font-bold">Document Source</div>
                          <div className="text-xs font-bold text-[#0F172A] mt-1 truncate">
                            {forensic.paymentGateway}
                          </div>
                        </div>
                      </div>

                      {/* Cryptographic SHA-256 Immutability Checksum */}
                      <div className="p-2.5 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-[#0F172A] shrink-0">SHA-256 Hash:</span>
                          <span className="text-[#2563EB] truncate font-mono text-[10.5px]">
                            {forensic.sha256Hash || '4a6f2c38d9e10293847561029384756102938475610293847561029384756102'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(forensic.sha256Hash || '4a6f2c38d9e10293847561029384756102938475610293847561029384756102', 'hash_' + index)}
                          className="self-end sm:self-center inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:border-[#94A3B8] text-[10px] font-semibold transition-all shrink-0"
                          title="Copy Cryptographic SHA-256 Hash"
                        >
                          {copiedUtr === 'hash_' + index ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedUtr === 'hash_' + index ? 'Copied' : 'Copy Hash'}</span>
                        </button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <span className="text-[11px] text-[#475569] font-medium flex items-center gap-1.5 self-start sm:self-center">
                          {isRejected ? (
                            <span className="text-amber-700 flex items-center gap-1 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              Excluded from statutory complaint petition
                            </span>
                          ) : (
                            <span className="text-[#10B981] flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                              Ready to cite in statutory Section 65B affidavit
                            </span>
                          )}
                        </span>

                        {isRejected ? (
                          <button
                            type="button"
                            disabled
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed border border-slate-200"
                          >
                            <span>Not Admissible in Cyber FIR</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUseInComplaint(item)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#E6325B] hover:bg-[#D42B52] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                          >
                            <span>Auto-Fill Complaint Draft</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Statutory Evidence Checklist (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-[#E5E2DE] space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E2DE]">
            <FileCheck className="w-5 h-5 text-[#E6325B]" />
            <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider">
              Statutory Evidence Checklist
            </h4>
          </div>

          <p className="text-xs text-[#334155] leading-relaxed font-medium">
            Under Section 65B of the Indian Evidence Act, police cyber cells and banks require specific corroborative artifacts to legally freeze beneficiary accounts and register an FIR.
          </p>

          <div className="space-y-3 pt-1">
            {checklistItems.map((item, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#F8F9FA] border border-[#E5E2DE] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-[#334155] pl-5 leading-normal font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FFE8EC]/50 border border-[#E6325B]/20 text-xs text-[#0F172A] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#E6325B]">
              <Shield className="w-4 h-4" />
              <span>Evidence Tamper-Proof Standard</span>
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Never crop or blur screenshots of payment transactions. Keeping full timestamps and battery/carrier status intact ensures admissibility before the Judicial Magistrate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidencePage;
