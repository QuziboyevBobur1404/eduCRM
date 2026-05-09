import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER';
  tenantId: string;
  avatar?: string;
  teacherId?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
  can: (permission: string) => boolean;
}

const rolePermissions: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'student.create', 'student.read', 'student.update', 'student.delete',
    'teacher.create', 'teacher.read', 'teacher.update', 'teacher.delete',
    'group.create', 'group.read', 'group.update', 'group.delete',
    'course.create', 'course.read', 'course.update', 'course.delete',
    'attendance.create', 'attendance.read', 'attendance.update',
    'payment.create', 'payment.read', 'payment.update',
    'exam.create', 'exam.read', 'exam.update', 'exam.delete',
    'analytics.read', 'notification.read', 'audit.read',
    'user.read', 'user.update', 'user.delete',
  ],
  TEACHER: [
    'student.create', 'student.read',
    'group.read',
    'attendance.create', 'attendance.read',
    'exam.create', 'exam.read', 'exam.update',
    'notification.read',
  ],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, accessToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
        }
        set({ user, accessToken, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      can: (permission) => {
        const { user } = get();
        if (!user) return false;
        const perms = rolePermissions[user.role] || [];
        return perms.includes('*') || perms.includes(permission);
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
