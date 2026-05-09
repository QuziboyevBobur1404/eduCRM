import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { attendanceApi } from '../lib/api';

export function useGroupAttendance(groupId: string, date: string) {
  return useQuery({
    queryKey: ['attendance', 'group', groupId, date],
    queryFn: () => attendanceApi.getGroupAttendance(groupId, date),
    enabled: !!groupId && !!date,
  });
}

export function useBulkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.bulkCreate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Davomat saqlandi');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}

export function useAttendanceList(filters?: any) {
  return useQuery({
    queryKey: ['attendance', 'list', filters],
    queryFn: () => attendanceApi.getAll(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useAttendanceAnalytics(params?: any) {
  return useQuery({
    queryKey: ['attendance', 'analytics', params],
    queryFn: () => attendanceApi.getAnalytics(params),
    staleTime: 1000 * 60 * 5,
  });
}
