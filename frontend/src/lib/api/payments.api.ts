import { apiClient } from './client';

export const paymentsApi = {
  getAll: (params?: any) => apiClient.get('/payments', { params }),
  create: (data: any) => apiClient.post('/payments', data),
  getOverdue: () => apiClient.get('/payments/overdue'),
  getAnalytics: (year?: number) =>
    apiClient.get('/payments/analytics', { params: { year } }),
};
