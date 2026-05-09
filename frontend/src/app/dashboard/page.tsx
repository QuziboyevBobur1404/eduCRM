'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, GraduationCap, BookOpen, TrendingUp,
  CreditCard, AlertTriangle, CalendarDays, Clock,
} from 'lucide-react';
import { analyticsApi, groupsApi } from '@/lib/api/index';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

function StatCard({
  title, value, sub, icon: Icon, color, index,
}: {
  title: string; value: string | number; sub?: string;
  icon: any; color: string; index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="bg-card border border-border rounded-2xl p-5 card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-muted animate-pulse ${className}`} />
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboard() as any,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const { data: todayGroups } = useQuery({
    queryKey: ['groups', 'today'],
    queryFn: () => groupsApi.getToday() as any,
    staleTime: 1000 * 60 * 10,
  });

  const { data: growthData } = useQuery({
    queryKey: ['analytics', 'growth', new Date().getFullYear()],
    queryFn: () => analyticsApi.getGrowth(new Date().getFullYear()) as any,
    staleTime: 1000 * 60 * 60,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const s = stats as any;

  const statCards = [
    {
      title: 'Jami o\'quvchilar',
      value: s?.students?.total ?? 0,
      sub: `${s?.students?.active ?? 0} faol`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'O\'qituvchilar',
      value: s?.teachers?.total ?? 0,
      sub: 'Faol o\'qituvchilar',
      icon: GraduationCap,
      color: 'bg-violet-500/10 text-violet-500',
    },
    {
      title: 'Faol guruhlar',
      value: s?.groups?.total ?? 0,
      sub: 'Hozirda faol',
      icon: BookOpen,
      color: 'bg-emerald-500/10 text-emerald-500',
    },
    {
      title: 'Bu oylik daromad',
      value: formatCurrency(s?.revenue?.thisMonth ?? 0),
      sub: `${s?.revenue?.thisMonthCount ?? 0} ta to'lov`,
      icon: TrendingUp,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Bugungi davomat',
      value: s?.attendance?.today ?? 0,
      sub: 'Qayd etilgan',
      icon: CalendarDays,
      color: 'bg-sky-500/10 text-sky-500',
    },
    {
      title: 'Muddati o\'tgan to\'lovlar',
      value: s?.payments?.overdue ?? 0,
      sub: 'Qarzdorlar',
      icon: AlertTriangle,
      color: 'bg-red-500/10 text-red-500',
    },
    {
      title: 'Nofaol o\'quvchilar',
      value: s?.students?.inactive ?? 0,
      sub: 'Davomat muammosi',
      icon: Users,
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      title: 'Bugungi darslar',
      value: (todayGroups as any[])?.length ?? 0,
      sub: 'Jadvalda',
      icon: Clock,
      color: 'bg-indigo-500/10 text-indigo-500',
    },
  ];

  const chartData = (growthData as any[])?.map((d: any) => ({
    month: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'][d.month - 1],
    daromad: d.revenue,
    oqvchilar: d.newStudents,
    davomat: d.attendanceRate,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bosh sahifa</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Oylik daromad (UZS)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220,82%,55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(220,82%,55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(v: any) => [formatCurrency(v), 'Daromad']}
              />
              <Area
                type="monotone" dataKey="daromad"
                stroke="hsl(220,82%,55%)" strokeWidth={2}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* New students chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Yangi o'quvchilar (oylik)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="oqvchilar" fill="hsl(220,82%,55%)" radius={[4, 4, 0, 0]} name="Yangi o'quvchilar" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Today's lessons */}
      {(todayGroups as any[])?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Bugungi darslar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(todayGroups as any[]).map((group: any) => (
              <div key={group.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{group.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.teacher?.user?.firstName} {group.teacher?.user?.lastName}
                    {' · '}
                    {group._count?.students ?? 0} o'quvchi
                  </p>
                  {group.schedules?.[0] && (
                    <p className="text-xs text-primary">
                      {group.schedules[0].startTime} – {group.schedules[0].endTime}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent students */}
      {s?.recentStudents?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">So'nggi qo'shilgan o'quvchilar</h3>
          <div className="space-y-3">
            {s.recentStudents.map((student: any) => (
              <div key={student.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium shrink-0">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(student.createdAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  student.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                  student.status === 'FROZEN' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                  'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}>
                  {student.status === 'ACTIVE' ? 'Faol' : student.status === 'FROZEN' ? 'Muzlatilgan' : 'Nofaol'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
