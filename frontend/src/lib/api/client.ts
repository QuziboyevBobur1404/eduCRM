import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — access token qo'shish
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 da auto refresh
apiClient.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = data?.data?.accessToken || data?.accessToken;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch {
        localStorage.removeItem('accessToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);
