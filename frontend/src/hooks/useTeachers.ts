import {
  useQuery, useMutation, useQueryClient, keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { teachersApi } from '../lib/api';

export function useTeachers(filters?: any) {
  return useQuery({
    queryKey: ['teachers', filters],
    queryFn: () => teachersApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ['teachers', id],
    queryFn: () => teachersApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: teachersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers'] });
      toast.success("O'qituvchi qo'shildi");
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}
