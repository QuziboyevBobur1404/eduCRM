'use client';

import { useAuthStore } from '@/store/auth.store';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sozlamalar</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Tizim va profil sozlamalari</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Profil ma'lumotlari</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Ism</label>
              <input defaultValue={user?.firstName} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Familiya</label>
              <input defaultValue={user?.lastName} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input defaultValue={user?.email} disabled className="w-full h-10 px-3 rounded-xl border border-input bg-muted text-sm text-muted-foreground cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Rol</label>
            <input defaultValue={user?.role} disabled className="w-full h-10 px-3 rounded-xl border border-input bg-muted text-sm text-muted-foreground cursor-not-allowed" />
          </div>
          <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Saqlash
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Xavfsizlik</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Joriy parol</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Yangi parol</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Parolni o'zgartirish
          </button>
        </div>
      </div>
    </div>
  );
}
