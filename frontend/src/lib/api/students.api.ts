import { apiClient } from './client';

export const studentsApi = {
  getAll: (params?: any) => apiClient.get('/students', { params }),
  getOne: (id: string) => apiClient.get(`/students/${id}`),
  create: (data: any) => apiClient.post('/students', data),
  update: (id: string, data: any) => apiClient.patch(`/students/${id}`, data),
  delete: (id: string) => apiClient.delete(`/students/${id}`),
  getAttendance: (id: string, params?: any) =>
    apiClient.get(`/students/${id}/attendance`, { params }),
  getPayments: (id: string) => apiClient.get(`/students/${id}/payments`),
  getExams: (id: string) => apiClient.get(`/students/${id}/exams`),
};
