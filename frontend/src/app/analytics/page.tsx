'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Users, GraduationCap } from 'lucide-react';
import { analyticsApi } from '@/lib/api/index';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboard() as any,
  });

  const { data: growthData } = useQuery({
    queryKey: ['analytics', 'growth'],
    queryFn: () => analyticsApi.getGrowth(new Date().getFullYear()) as any,
  });

  const { data: topTeachers } = useQuery({
    queryKey: ['analytics', 'top-teachers'],
    queryFn: () => analyticsApi.getTopTeachers() as any,
  });

  const s = (stats as any) || {};
  const growth = ((growthData as any) || []).map((d: any) => ({
    month: ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'][d.month-1],
    daromad: d.revenue,
    oqvchilar: d.newStudents,
  }));
  const teachers = (topTeachers as any) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analitika</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Tizim statistikasi va hisobotlar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami o\'quvchilar', value: s.students?.total ?? 0, icon: Users, color: 'bg-blue-500/10 text-blue-500' },
          { label: 'Faol guruhlar', value: s.groups?.total ?? 0, icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-500' },
          { label: 'Bu oylik daromad', value: formatCurrency(s.revenue?.thisMonth ?? 0), icon: TrendingUp, color: 'bg-green-500/10 text-green-500' },
          { label: 'O\'qituvchilar', value: s.teachers?.total ?? 0, icon: GraduationCap, color: 'bg-violet-500/10 text-violet-500' },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <p className="text-xl font-bold text-foreground mt-1">{card.value}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Oylik daromad</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220,82%,55%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(220,82%,55%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="daromad" stroke="hsl(220,82%,55%)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Yangi o'quvchilar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="oqvchilar" fill="hsl(220,82%,55%)" radius={[4,4,0,0]} name="O'quvchilar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top teachers */}
      {teachers.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Eng yaxshi o'qituvchilar</h3>
          <div className="space-y-3">
            {teachers.map((t: any, i: number) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground w-5">{i+1}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                  {t.firstName?.[0]}{t.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.firstName} {t.lastName}</p>
                  <p className="text-xs text-muted-foreground">{t.studentCount ?? 0} o'quvchi · {t.groupCount ?? 0} guruh</p>
                </div>
                <span className="text-sm font-semibold text-primary">{t.attendanceRate ?? 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { BookOpen } from 'lucide-react';
