'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, GraduationCap, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { teachersApi } from '@/lib/api/index';
import { useAuthStore } from '@/store/auth.store';
import { formatDate } from '@/lib/utils';

export default function TeachersPage() {
  const router = useRouter();
  const { can } = useAuthStore();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['teachers', { search, page }],
    queryFn: () => teachersApi.getAll({ search, page, limit: 20 }) as any,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teachersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['teachers'] }); toast.success("O'qituvchi o'chirildi"); },
    onError: () => toast.error('Xatolik yuz berdi'),
  });

  const teachers = (data as any)?.data || [];
  const meta = (data as any)?.meta || {};

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">O'qituvchilar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Jami {meta.total ?? 0} ta o'qituvchi</p>
        </div>
        {can('teacher.create') && (
          <button
            onClick={() => router.push('/teachers/new')}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> O'qituvchi qo'shish
          </button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Ism yoki email..."
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Yuklanmoqda...</div>
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">O'qituvchi topilmadi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">O'qituvchi</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Mutaxassislik</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Guruhlar</th>
                <th className="px-5 py-3.5 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((teacher: any) => (
                <tr key={teacher.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shrink-0">
                        {teacher.user?.avatar
                          ? <img src={teacher.user.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
                          : `${teacher.user?.firstName?.[0]}${teacher.user?.lastName?.[0]}`}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{teacher.user?.firstName} {teacher.user?.lastName}</p>
                        <p className="text-xs text-muted-foreground">{teacher.user?.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{teacher.user?.email}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{teacher.speciality || '—'}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-foreground">{teacher._count?.groups ?? 0} ta guruh</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => router.push(`/teachers/${teacher.id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {can('teacher.update') && (
                        <button onClick={() => router.push(`/teachers/${teacher.id}/edit`)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {can('teacher.delete') && (
                        <button onClick={() => { if(confirm('O\'chirishni tasdiqlaysizmi?')) deleteMutation.mutate(teacher.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
            <span className="text-sm text-muted-foreground">{meta.total} dan {((page-1)*20)+1}–{Math.min(page*20, meta.total)} ko'rsatilmoqda</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 transition-all">Oldingi</button>
              <span className="text-sm text-muted-foreground">{page} / {meta.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p+1))} disabled={page===meta.totalPages} className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 transition-all">Keyingi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
