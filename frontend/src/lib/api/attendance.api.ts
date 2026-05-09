import { apiClient } from './client';

export const attendanceApi = {
  getAll: (params?: any) => apiClient.get('/attendance', { params }),
  bulkCreate: (data: any) => apiClient.post('/attendance/bulk', data),
  getGroupAttendance: (groupId: string, date: string) =>
    apiClient.get(`/attendance/group/${groupId}`, { params: { date } }),
  getAnalytics: (params?: any) =>
    apiClient.get('/attendance/analytics', { params }),
};
