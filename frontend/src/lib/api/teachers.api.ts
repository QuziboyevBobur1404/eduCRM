import { apiClient } from './client';

export const teachersApi = {
  getAll: (params?: any) => apiClient.get('/teachers', { params }),
  getOne: (id: string) => apiClient.get(`/teachers/${id}`),
  create: (data: any) => apiClient.post('/teachers', data),
  update: (id: string, data: any) => apiClient.patch(`/teachers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teachers/${id}`),
  getStats: (id: string) => apiClient.get(`/teachers/${id}/stats`),
};
