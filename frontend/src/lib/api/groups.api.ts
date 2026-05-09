import { apiClient } from './client';

export const groupsApi = {
  getAll: (params?: any) => apiClient.get('/groups', { params }),
  getOne: (id: string) => apiClient.get(`/groups/${id}`),
  create: (data: any) => apiClient.post('/groups', data),
  update: (id: string, data: any) => apiClient.patch(`/groups/${id}`, data),
  delete: (id: string) => apiClient.delete(`/groups/${id}`),
  addStudents: (id: string, data: { studentIds: string[] }) =>
    apiClient.post(`/groups/${id}/students`, data),
  removeStudent: (groupId: string, studentId: string) =>
    apiClient.delete(`/groups/${groupId}/students/${studentId}`),
  setSchedules: (id: string, data: any[]) =>
    apiClient.put(`/groups/${id}/schedules`, data),
  getStats: (id: string) => apiClient.get(`/groups/${id}/stats`),
};
