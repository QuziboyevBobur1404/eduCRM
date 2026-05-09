'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { studentsApi } from '@/lib/api/index';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVE:   { label: 'Faol',        color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  INACTIVE: { label: 'Nofaol',      color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  FROZEN:   { label: 'Muzlatilgan', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
};

export default function StudentsPage() {
  const router = useRouter();
  const { can } = useAuthStore();
  const qc = useQueryClient();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['students', { search, status, page }],
    queryFn: () => studentsApi.getAll({ search, status, page, limit: 20 }) as any,
    staleTime: 1000 * 60 * 2,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success("O'quvchi o'chirildi");
    },
    onError: () => toast.error('Xatolik yuz berdi'),
  });

  const students = (data as any)?.data || [];
  const meta = (data as any)?.meta || {};

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`"${name}" ni o'chirishni tasdiqlaysizmi?`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">O'quvchilar</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Jami {meta.total ?? 0} ta o'quvchi
          </p>
        </div>
        {can('student.create') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/students/new')}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-brand hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            O'quvchi qo'shish
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Ism, familiya yoki telefon..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          <option value="">Barcha holatlar</option>
          <option value="ACTIVE">Faol</option>
          <option value="INACTIVE">Nofaol</option>
          <option value="FROZEN">Muzlatilgan</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Yuklanmoqda...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">O'quvchi topilmadi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">O'quvchi</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Telefon</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Guruh</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Holat</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Qo'shilgan</th>
                <th className="px-5 py-3.5 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student: any) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shrink-0">
                        {student.avatar ? (
                          <img src={student.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
                        ) : (
                          `${student.firstName[0]}${student.lastName[0]}`
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground sm:hidden">{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-foreground">{student.phone}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {student.groupStudents?.slice(0, 2).map((gs: any) => (
                        <span key={gs.group?.id} className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {gs.group?.name}
                        </span>
                      ))}
                      {student.groupStudents?.length > 2 && (
                        <span className="text-xs text-muted-foreground">+{student.groupStudents.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_LABELS[student.status]?.color}`}>
                      {STATUS_LABELS[student.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(student.joinedDate || student.createdAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => router.push(`/students/${student.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {can('student.update') && (
                        <button
                          onClick={() => router.push(`/students/${student.id}/edit`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {can('student.delete') && (
                        <button
                          onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {meta.total} dan {((page - 1) * 20) + 1}–{Math.min(page * 20, meta.total)} ko'rsatilmoqda
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Oldingi
              </button>
              <span className="text-sm text-muted-foreground">{page} / {meta.totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="h-8 px-3 rounded-lg text-sm border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
