'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, BookOpen, Users, Clock } from 'lucide-react';
import { groupsApi } from '@/lib/api/index';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-500/10 text-green-600 dark:text-green-400',
  INACTIVE: 'bg-red-500/10 text-red-600 dark:text-red-400',
  COMPLETED: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  UPCOMING: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};
const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Faol', INACTIVE: 'Nofaol', COMPLETED: 'Tugagan', UPCOMING: 'Kutilmoqda',
};

export default function GroupsPage() {
  const router = useRouter();
  const { can } = useAuthStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['groups', { search, page }],
    queryFn: () => groupsApi.getAll({ search, page, limit: 20 }) as any,
  });

  const groups = (data as any)?.data || [];
  const meta = (data as any)?.meta || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Guruhlar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Jami {meta.total ?? 0} ta guruh</p>
        </div>
        {can('group.create') && (
          <button onClick={() => router.push('/groups/new')} className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Guruh qo'shish
          </button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Guruh nomi..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Guruh topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group: any) => (
            <div key={group.id} onClick={() => router.push(`/groups/${group.id}`)} className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-medium hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[group.isActive ? 'ACTIVE' : 'INACTIVE'])}>
                  {STATUS_LABELS[group.isActive ? 'ACTIVE' : 'INACTIVE']}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{group.course?.name}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{group._count?.students ?? 0} o'quvchi</span>
                {group.schedules?.[0] && (
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{group.schedules[0].startTime}–{group.schedules[0].endTime}</span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {group.teacher?.user?.firstName} {group.teacher?.user?.lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
