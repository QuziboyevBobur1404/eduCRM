import {
  useQuery, useMutation, useQueryClient, keepPreviousData,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { groupsApi } from '../lib/api';

export function useGroups(filters?: any) {
  return useQuery({
    queryKey: ['groups', filters],
    queryFn: () => groupsApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => groupsApi.getOne(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: groupsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Guruh yaratildi');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}
