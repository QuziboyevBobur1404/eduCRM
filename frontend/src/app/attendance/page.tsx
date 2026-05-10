'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { groupsApi, attendanceApi } from '@/lib/api/index';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: groupsData } = useQuery({
    queryKey: ['groups', 'all'],
    queryFn: () => groupsApi.getAll({ limit: 100 }) as any,
  });

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['attendance', 'group', selectedGroupId, selectedDate],
    queryFn: () => attendanceApi.getGroupAttendance(selectedGroupId, selectedDate) as any,
    enabled: !!selectedGroupId,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['attendance', 'analytics'],
    queryFn: () => attendanceApi.getAnalytics() as any,
  });

  const groups = (groupsData as any)?.data || [];
  const lessons = (lessonData as any)?.data || (lessonData as any) || [];
  const analytics = (analyticsData as any) || {};

  const STATUS_COLORS: Record<string, string> = {
    PRESENT: 'bg-green-500/10 text-green-600 border-green-200',
    ABSENT:  'bg-red-500/10 text-red-600 border-red-200',
    LATE:    'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  };
  const STATUS_LABELS: Record<string, string> = {
    PRESENT: 'Keldi',
    ABSENT:  'Kelmadi',
    LATE:    'Kech keldi',
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Davomat</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Dars davomati kuzatuvi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bugun qayd etilgan', value: analytics.todayTotal ?? 0, icon: CalendarDays, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'Kelganlar', value: analytics.todayPresent ?? 0, icon: Users, color: 'bg-green-500/10 text-green-500' },
          { label: 'Davomat %', value: `${analytics.todayRate ?? 0}%`, icon: TrendingUp, color: 'bg-primary/10 text-primary' },
          { label: "Ko'p qoldirganlar", value: analytics.absentCount ?? 0, icon: AlertTriangle, color: 'bg-red-500/10 text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson attendance */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Guruh davomati</h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          >
            <option value="">Guruh tanlang</option>
            {groups.map((g: any) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {!selectedGroupId ? (
          <p className="text-center text-muted-foreground text-sm py-8">Guruh tanlang</p>
        ) : isLoading ? (
          <p className="text-center text-muted-foreground text-sm py-8">Yuklanmoqda...</p>
        ) : lessons.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Bu sana uchun davomat topilmadi</p>
        ) : (
          <div className="space-y-2">
            {lessons.map((item: any) => (
              <div key={item.studentId || item.student?.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {item.student?.firstName?.[0]}{item.student?.lastName?.[0]}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.student?.firstName} {item.student?.lastName}
                  </span>
                </div>
                <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', STATUS_COLORS[item.status] || 'bg-muted text-muted-foreground border-border')}>
                  {STATUS_LABELS[item.status] || 'Noma\'lum'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
