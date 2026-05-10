'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, Moon, Sun, User, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnreadCount() as any,
    refetchInterval: 30000,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    router.push('/login');
    toast.success('Muvaffaqiyatli chiqildi');
  };

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    TEACHER: 'O\'qituvchi',
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 z-10">
      {/* Left - breadcrumb or page title handled by each page */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => router.push('/notifications')}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <Bell className="w-4 h-4" />
          {(unreadCount as any) > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 pl-1 pr-3 h-9 rounded-lg hover:bg-muted transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
              ) : (
                <span className="text-xs font-medium text-primary">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-foreground leading-none">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-muted-foreground leading-none mt-0.5">
                {roleLabel[user?.role || ''] || user?.role}
              </span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', userMenuOpen && 'rotate-180')} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-xl shadow-strong py-1 z-50">
              <button
                onClick={() => { router.push('/settings/profile'); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profil
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
