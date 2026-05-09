import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentsApi } from '../lib/api';

export function useStudents(filters?: any) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.getAll(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['analytics'] });
      toast.success("O'quvchi muvaffaqiyatli qo'shildi");
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}

export function useUpdateStudent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => studentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success("O'quvchi ma'lumotlari yangilandi");
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success("O'quvchi o'chirildi");
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}
