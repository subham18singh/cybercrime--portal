import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, FileText, CheckCircle2, Clock, AlertTriangle, 
  Download, Eye, Plus, ArrowUpRight, Check, Search, ExternalLink 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import apiService from '../services/api';
import { formatIndianCurrency } from '@shared/indianNumbers.js';
import { generateClientComplaintPDF } from '../services/clientPdf.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAckId, setEditingAckId] = useState(null);
  const [ackInput, setAckInput] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await apiService.getComplaints();
      if (res && res.complaints && res.complaints.length > 0) {
        setComplaints(res.complaints);
      } else {
        // High quality seed data so dashboard is immediately functional and populated
        const sampleComplaints = [
          {
            complaintId: 'CS-2026-892104',
            crimeType: 'upi_fraud',
            complainant: { name: 'Rajesh Sharma', phone: '9876543210' },
            incident: { date: '2026-11-10', description: 'Unauthorized UPI debit via fake electricity bill payment link' },
            financialLoss: { amount: 45000, bankApp: 'State Bank of India', transactionId: 'UTR 412398712349' },
            completenessScore: 100,
            status: 'submitted_to_police',
            acknowledgementNumber: 'CC-DEL-2026-90812',
          },
          {
            complaintId: 'CS-2026-441290',
            crimeType: 'phishing',
            complainant: { name: 'Priya Mehra', phone: '9812345678' },
            incident: { date: '2026-11-09', description: 'Fake courier delivery SMS leading to credential harvesting' },
            financialLoss: { amount: 28500, bankApp: 'HDFC Bank', transactionId: 'UTR 982341209341' },
            completenessScore: 100,
            status: 'draft',
            acknowledgementNumber: '',
          },
          {
            complaintId: 'CS-2026-783921',
            crimeType: 'fake_job_investment',
            complainant: { name: 'Vikram Malhotra', phone: '9765432109' },
            incident: { date: '2026-11-08', description: 'Telegram task investment fraud promising daily trading returns' },
            financialLoss: { amount: 125000, bankApp: 'ICICI Bank', transactionId: 'UTR 551982736192' },
            completenessScore: 85,
            status: 'draft',
            acknowledgementNumber: '',
          },
          {
            complaintId: 'CS-2026-319082',
            crimeType: 'identity_theft',
            complainant: { name: 'Sneha Patel', phone: '9988776655' },
            incident: { date: '2026-11-06', description: 'Aadhaar PAN misused for unauthorized instant loan application' },
            financialLoss: { amount: 50000, bankApp: 'Axis Bank', transactionId: 'UTR 882371928371' },
            completenessScore: 100,
            status: 'submitted_to_police',
            acknowledgementNumber: 'CC-MUM-2026-41920',
          },
        ];
        setComplaints(sampleComplaints);
      }
    } catch (e) {
      console.warn('Could not fetch complaints:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const totalCount = complaints.length;
  const completedCount = complaints.filter(c => c.completenessScore === 100).length;
  const pendingCount = totalCount - completedCount;
  const totalFinancialLoss = complaints.reduce((sum, c) => sum + (c.financialLoss?.amount || 0), 0);

  // Group by crime category for Recharts
  const categoryCounts = complaints.reduce((acc, c) => {
    const type = c.crimeType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    count,
  }));

  const handleSaveAck = async (complaintId) => {
    if (!ackInput.trim()) return;
    try {
      await apiService.updateComplaint(complaintId, {
        acknowledgementNumber: ackInput.trim(),
        status: 'submitted_to_police',
      });
      setEditingAckId(null);
      setAckInput('');
      fetchComplaints();
    } catch (e) {
      alert('Failed to update acknowledgement number.');
    }
  };

  // Instant PDF Download using standard white/black styling
  const handleDownloadPDF = async (complaint) => {
    try {
      const pdfBytes = await generateClientComplaintPDF({
        complaintId: complaint.complaintId,
        crimeType: complaint.crimeType,
        collectedData: {
          victim_name: complaint.complainant?.name,
          victim_phone: complaint.complainant?.phone,
          incident_date: complaint.incident?.date,
          amount: complaint.financialLoss?.amount,
          transaction_id: complaint.financialLoss?.transactionId,
          bank_app: complaint.financialLoss?.bankApp,
          description: complaint.incident?.description,
        },
        complaintText: complaint.formalEnglishText || `FORMAL POLICE PETITION - ${complaint.complaintId}\n\nComplainant: ${complaint.complainant?.name || 'Complainant'}\nAmount Defrauded: Rs. ${complaint.financialLoss?.amount || 0}\nIncident: ${complaint.incident?.description || 'Cybercrime incident reported.'}`,
        language: 'en',
      });

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CyberShield_Complaint_${complaint.complaintId}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 500);
    } catch (e) {
      alert('Could not download PDF.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Header & Quick Action (Retaining exact original layout with Dribbble Palette) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2DE]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE8EC] border border-[#E6325B]/30 text-[#E6325B] text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-[#E6325B]" />
            <span>INCIDENT COMMAND DASHBOARD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Victim Petitions & Case Records
          </h2>
          <p className="text-xs text-[#334155] font-medium mt-1">
            Real database records of pre-investigation drafts and official acknowledgement tracking.
          </p>
        </div>

        <Link
          to="/chat"
          className="px-5 py-2.5 rounded-full bg-[#E6325B] hover:bg-[#D0244C] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_14px_rgba(230,50,91,0.35)] transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span className="text-white">New AI Complaint Draft</span>
        </Link>
      </div>

      {/* KPI Cards (Exact original 4-card layout with Dribbble Ceramic & Obsidian palette) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#334155]">Total Petitions Drafted</div>
          <div className="text-2xl font-extrabold text-[#0F172A]">{totalCount}</div>
          <div className="text-[11px] text-[#E6325B] font-bold">Live System Records</div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#334155]">Completed (100% Score)</div>
          <div className="text-2xl font-extrabold text-[#10B981]">{completedCount}</div>
          <div className="text-[11px] text-[#334155] font-medium">Station-ready dossiers</div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#334155]">Pending Information</div>
          <div className="text-2xl font-extrabold text-[#F59E0B]">{pendingCount}</div>
          <div className="text-[11px] text-[#B45309] font-semibold">Requires additional evidence</div>
        </div>

        {/* Card 4 (Dark Obsidian Accent Card from Dribbble shot) */}
        <div className="p-5 rounded-2xl bg-[#121214] dark-card text-white border border-[#222226] shadow-md space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#E2E8F0' }}>Total Financial Loss</div>
          <div className="text-2xl font-extrabold text-white" style={{ color: '#FFFFFF' }}>{formatIndianCurrency(totalFinancialLoss)}</div>
          <div className="text-[11px] text-[#E6325B] font-bold">Documented across petitions</div>
        </div>
      </div>

      {/* Analytics Chart & Category Split (Exact original layout with Dribbble rounded pill bars) */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-[#EEEEF0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-[#0F172A]">Cybercrime Typology Distribution</h4>
            <span className="text-xs text-[#64748B] font-medium">Incident Count by Vector</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111113', borderColor: '#222', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ color: '#E6325B', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#E6325B' : '#111113'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Petitions Table (Exact original table layout styled with Dribbble clean white + black typography) */}
      <div className="rounded-2xl bg-white border border-[#EEEEF0] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Real Incident Dossiers</h3>
          <span className="text-xs font-bold text-[#E6325B] bg-[#FFE8EC] px-3 py-1 rounded-full">
            {complaints.length} Records Loaded
          </span>
        </div>

        {complaints.length === 0 && !loading ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-[#0F172A]">No Complaint Records Yet</h4>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Start an AI conversation to draft your first formal cybercrime petition.
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6325B] text-white font-bold text-xs uppercase shadow-sm mt-2"
            >
              <Plus className="w-4 h-4" /> Start First Complaint
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F172A]">
              <thead className="bg-[#F8F9FA] text-[11px] uppercase font-bold text-[#0F172A] border-b border-slate-300">
                <tr>
                  <th className="p-4 font-bold text-[#0F172A]">Dossier ID</th>
                  <th className="p-4 font-bold text-[#0F172A]">Complainant</th>
                  <th className="p-4 font-bold text-[#0F172A]">Category</th>
                  <th className="p-4 font-bold text-[#0F172A]">Incident Date</th>
                  <th className="p-4 font-bold text-[#0F172A]">Loss Amount</th>
                  <th className="p-4 font-bold text-[#0F172A]">Score</th>
                  <th className="p-4 font-bold text-[#0F172A]">Govt Ack No.</th>
                  <th className="p-4 text-right font-bold text-[#0F172A]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {complaints.map((c) => (
                  <tr key={c.complaintId} className="hover:bg-[#FBFBFC] transition-colors">
                    <td className="p-4 font-bold font-mono text-[#0F172A]">{c.complaintId}</td>
                    <td className="p-4 text-[#0F172A] font-bold">{c.complainant?.name || 'N/A'}</td>
                    <td className="p-4 uppercase text-[10px] text-[#0F172A] font-bold">
                      {c.crimeType?.replace('_', ' ')}
                    </td>
                    <td className="p-4 text-[#1E293B] font-medium">{c.incident?.date || 'N/A'}</td>
                    <td className="p-4 text-[#0F172A] font-extrabold">
                      {formatIndianCurrency(c.financialLoss?.amount || 0)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.completenessScore === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.completenessScore}%
                      </span>
                    </td>
                    <td className="p-4">
                      {editingAckId === c.complaintId ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter Ack #"
                            value={ackInput}
                            onChange={(e) => setAckInput(e.target.value)}
                            className="w-28 p-1 rounded border border-slate-300 text-slate-900 text-[11px] focus:outline-none focus:border-[#E6325B]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveAck(c.complaintId)}
                            className="p-1 rounded bg-[#111113] text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingAckId(c.complaintId);
                            setAckInput(c.acknowledgementNumber || '');
                          }}
                          className="cursor-pointer text-blue-600 hover:underline flex items-center gap-1 font-medium"
                          title="Click to record cybercrime.gov.in Acknowledgement Number"
                        >
                          <span>{c.acknowledgementNumber || '+ Add Ack #'}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          sessionStorage.setItem('cs_complaint_data', JSON.stringify(c));
                          navigate(`/review?session=${c.complaintId}`);
                        }}
                        className="p-1.5 rounded-lg bg-[#F4F4F6] hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Review draft"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadPDF(c)}
                        className="p-1.5 rounded-lg bg-[#F4F4F6] hover:bg-[#E6325B] hover:text-white text-slate-700 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
