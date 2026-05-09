// Re-export everything from the main api file
export {
  apiClient,
  studentsApi,
  paymentsApi,
  attendanceApi,
  analyticsApi,
} from './index';

export const notificationsApi = {
  getAll: (params?: any) =>
    import('./index').then(m => m.apiClient.get('/notifications', { params })),
  getUnreadCount: () =>
    import('./index').then(m => m.apiClient.get('/notifications/unread-count').then((r: any) => r?.count || 0)),
  markRead: (id: string) =>
    import('./index').then(m => m.apiClient.patch(`/notifications/${id}/read`)),
  markAllRead: () =>
    import('./index').then(m => m.apiClient.patch('/notifications/mark-all-read')),
};

export const authApi = {
  login: (data: { email: string; password: string }) =>
    import('./index').then(m => m.apiClient.post('/auth/login', data)),
  logout: () =>
    import('./index').then(m => m.apiClient.post('/auth/logout')),
  getMe: () =>
    import('./index').then(m => m.apiClient.get('/auth/me')),
};
