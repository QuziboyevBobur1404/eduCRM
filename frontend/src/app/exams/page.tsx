'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Plus, Search } from 'lucide-react';
import { examsApi } from '@/lib/api/index';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';

export default function ExamsPage() {
  const router = useRouter();
  const { can } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['exams', { page }],
    queryFn: () => examsApi.getAll({ page, limit: 20 }) as any,
  });

  const exams = (data as any)?.data || [];
  const meta = (data as any)?.meta || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imtihonlar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Jami {meta.total ?? 0} ta imtihon</p>
        </div>
        {can('exam.create') && (
          <button onClick={() => router.push('/exams/new')} className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Imtihon qo'shish
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Yuklanmoqda...</div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Imtihon topilmadi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Imtihon</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Guruh</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Sana</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Max ball</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Natijalar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {exams.map((exam: any) => (
                <tr key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-foreground">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">{exam.type}</p>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{exam.group?.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{formatDate(exam.date)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-foreground">{exam.maxScore}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{exam._count?.results ?? 0} ta</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
