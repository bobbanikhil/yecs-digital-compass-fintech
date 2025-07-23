import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  healthCheck: () => api.get('/'),

  // User management
  createUser: (userData) => api.post('/api/users', userData),

  // Business profile
  createBusinessProfile: (userId, profileData) =>
    api.post(`/api/users/${userId}/business-profile`, profileData),

  // Financial data
  createFinancialData: (userId, financialData) =>
    api.post(`/api/users/${userId}/financial-data`, financialData),

  // Score calculation
  calculateScore: (userId) =>
    api.post(`/api/users/${userId}/calculate-score`),

  getUserScores: (userId) =>
    api.get(`/api/users/${userId}/scores`),

  // Real-time preview
  getScorePreview: (previewData) =>
    api.post('/api/real-time-score-preview', previewData),

  // File upload
  uploadDocument: (formData) =>
    api.post('/api/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;
