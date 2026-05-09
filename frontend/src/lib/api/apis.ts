import { apiClient } from './client';

export const examsApi = {
  getAll: (params?: any) => apiClient.get('/exams', { params }),
  getOne: (id: string) => apiClient.get(`/exams/${id}`),
  create: (data: any) => apiClient.post('/exams', data),
  submitResults: (id: string, data: any) =>
    apiClient.post(`/exams/${id}/results`, data),
  getGroupStats: (groupId: string) =>
    apiClient.get(`/exams/group/${groupId}/stats`),
};

export const analyticsApi = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  getGrowth: (year?: number) =>
    apiClient.get('/analytics/growth', { params: { year } }),
  getTopTeachers: () => apiClient.get('/analytics/teachers'),
};

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/auth/change-password', data),
  register: (data: any) => apiClient.post('/auth/register', data),
};

export const notificationsApi = {
  getAll: (params?: any) => apiClient.get('/notifications', { params }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
  markAllRead: () => apiClient.patch('/notifications/read-all'),
};

export const coursesApi = {
  getAll: (params?: any) => apiClient.get('/courses', { params }),
  getOne: (id: string) => apiClient.get(`/courses/${id}`),
  create: (data: any) => apiClient.post('/courses', data),
  update: (id: string, data: any) => apiClient.patch(`/courses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/courses/${id}`),
};

export const usersApi = {
  getAll: (params?: any) => apiClient.get('/users', { params }),
  getMe: () => apiClient.get('/users/me'),
  update: (id: string, data: any) => apiClient.patch(`/users/${id}`, data),
  toggleActive: (id: string) =>
    apiClient.patch(`/users/${id}/toggle-active`),
};

export const settingsApi = {
  getAll: () => apiClient.get('/settings'),
  set: (key: string, value: any) => apiClient.put(`/settings/${key}`, { value }),
  setMany: (data: Record<string, any>) => apiClient.post('/settings/bulk', data),
};

export const filesApi = {
  upload: (file: File, entityId?: string, entityType?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload', formData, {
      params: { entityId, entityType },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => apiClient.delete(`/files/${id}`),
};
