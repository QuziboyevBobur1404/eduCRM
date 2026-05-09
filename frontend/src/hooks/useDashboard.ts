import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: analyticsApi.getDashboard,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function useGrowthChart(year?: number) {
  return useQuery({
    queryKey: ['analytics', 'growth', year],
    queryFn: () => analyticsApi.getGrowth(year),
    staleTime: 1000 * 60 * 60,
  });
}

export function useTopTeachers() {
  return useQuery({
    queryKey: ['analytics', 'teachers'],
    queryFn: analyticsApi.getTopTeachers,
    staleTime: 1000 * 60 * 10,
  });
}
