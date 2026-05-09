import {
  useQuery, useMutation, useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentsApi } from '../lib/api';

export function usePayments(filters?: any) {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentsApi.getAll(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useOverduePayments() {
  return useQuery({
    queryKey: ['payments', 'overdue'],
    queryFn: paymentsApi.getOverdue,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePaymentAnalytics(year?: number) {
  return useQuery({
    queryKey: ['payments', 'analytics', year],
    queryFn: () => paymentsApi.getAnalytics(year),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success("To'lov muvaffaqiyatli qabul qilindi");
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Xatolik yuz berdi');
    },
  });
}
