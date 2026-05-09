'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, TrendingUp, AlertTriangle, Clock, Plus } from 'lucide-react';
import { paymentsApi } from '@/lib/api/index';
import { useAuthStore } from '@/store/auth.store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS: Record<string, { label: string; color: string }> = {
  PAID:    { label: "To'langan",   color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  PENDING: { label: 'Kutilmoqda',  color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  OVERDUE: { label: "Muddati o'tgan", color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};

export default function PaymentsPage() {
  const { can } = useAuthStore();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data: summaryData } = useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: () => paymentsApi.getSummary() as any,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['payments', { status, page }],
    queryFn: () => paymentsApi.getAll({ status, page, limit: 20 }) as any,
  });

  const summary = (summaryData as any) || {};
  const payments = (data as any)?.data || [];
  const meta = (data as any)?.meta || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">To'lovlar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">To'lov tarixi va monitoring</p>
        </div>
        {can('payment.create') && (
          <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> To'lov qo'shish
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bu oylik daromad', value: formatCurrency(summary.thisMonth ?? 0), icon: TrendingUp, color: 'bg-green-500/10 text-green-500' },
          { label: 'Jami daromad', value: formatCurrency(summary.total ?? 0), icon: CreditCard, color: 'bg-primary/10 text-primary' },
          { label: 'Kutilmoqda', value: summary.pendingCount ?? 0, icon: Clock, color: 'bg-yellow-500/10 text-yellow-500' },
          { label: "Muddati o'tgan", value: summary.overdueCount ?? 0, icon: AlertTriangle, color: 'bg-red-500/10 text-red-500' },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', card.color)}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all">
        <option value="">Barcha holatlar</option>
        <option value="PAID">To'langan</option>
        <option value="PENDING">Kutilmoqda</option>
        <option value="OVERDUE">Muddati o'tgan</option>
      </select>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Yuklanmoqda...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">To'lov topilmadi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">O'quvchi</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Guruh</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Summa</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Sana</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground">{payment.student?.firstName} {payment.student?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{payment.student?.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{payment.group?.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(payment.amount)}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{formatDate(payment.createdAt)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS[payment.status]?.color)}>
                      {STATUS[payment.status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
            <span className="text-sm text-muted-foreground">{meta.total} dan {((page-1)*20)+1}–{Math.min(page*20, meta.total)}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 transition-all">Oldingi</button>
              <span className="text-sm text-muted-foreground">{page}/{meta.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p+1))} disabled={page===meta.totalPages} className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 transition-all">Keyingi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
