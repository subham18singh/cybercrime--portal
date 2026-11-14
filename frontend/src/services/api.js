import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token if available in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cybershield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for response handling and graceful error mapping
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage = error.response?.data?.message || error.message || 'Network communication error';
    return Promise.reject(new Error(customMessage));
  }
);

export const apiService = {
  // System Health
  checkHealth: () => apiClient.get('/health'),

  // Authentication
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getProfile: () => apiClient.get('/auth/me'),

  // AI Chat & Assistance
  sendChatMessage: (payload) => apiClient.post('/chat', payload),
  getChatHistory: (conversationId) => apiClient.get(`/chat/${conversationId}`),

  // Complaints & Drafts
  createComplaint: (data) => apiClient.post('/complaints', data),
  getComplaints: (params) => apiClient.get('/complaints', { params }),
  getComplaintById: (id) => apiClient.get(`/complaints/${id}`),
  updateComplaint: (id, data) => apiClient.put(`/complaints/${id}`, data),
  calculateCompleteness: (id) => apiClient.get(`/complaints/${id}/completeness`),

  // AI Cybercrime Classification
  classifyIncident: (narrative, language) => apiClient.post('/ai/classify', { narrative, language }),

  // Evidence & OCR
  uploadEvidence: (formData) => apiClient.post('/evidence/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  performOCR: (evidenceId) => apiClient.post('/evidence/ocr', { evidenceId }),
  redactEvidence: (evidenceId, sensitiveBoxes) => apiClient.post('/evidence/redact', { evidenceId, sensitiveBoxes }),

  // Incident Timeline Generation
  generateTimeline: (complaintId) => apiClient.post('/timeline/generate', { complaintId }),

  // Threat & Suspicious URL / Phone / Email Analysis
  analyzeThreat: (payload) => apiClient.post('/threat/analyze', payload),

  // PDF Document Generation
  generateComplaintPDF: (complaintId) => apiClient.post(`/complaints/${complaintId}/pdf`, {}, {
    responseType: 'blob',
  }),

  // Public Tracking by Ack Number
  trackComplaint: (ackNumber) => apiClient.get(`/complaints/track/${ackNumber}`),
};

export default apiService;
