import axios from 'axios';
import { useAuthStore } from './store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth-storage') 
        ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token 
        : null
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth state and redirect to login
      if (typeof window !== 'undefined') {
        const logout = useAuthStore.getState().logout;
        logout();
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const patientApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/patients', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/patients', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};

export const companyApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/companies', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/companies', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },
  getCompanyUnits: async (companyId: number) => {
    const response = await api.get(`/companies/${companyId}/units`);
    return response.data;
  },
  createCompanyUnit: async (companyId: number, data: any) => {
    const response = await api.post(`/companies/${companyId}/units`, data);
    return response.data;
  },
};

export const protocolApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/protocols', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/protocols/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/protocols', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/protocols/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/protocols/${id}`);
    return response.data;
  },
};

export const labResultApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/lab-results', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/lab-results/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/lab-results', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/lab-results/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/lab-results/${id}`);
    return response.data;
  },
  acceptSample: async (id: number) => {
    const response = await api.post(`/lab-results/${id}/accept`);
    return response.data;
  },
  approveSample: async (id: number) => {
    const response = await api.post(`/lab-results/${id}/approve`);
    return response.data;
  },
};

export const paymentApi = {
  getAll: async (params?: any) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

export default api;
