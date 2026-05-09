import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaymentStatus, StudentStatus, AttendanceStatus } from '../common/enums/index';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ── Dashboard KPIs (cached 5 min) ────────────────────────
  async getDashboardStats(tenantId: string) {
    const cacheKey = `dashboard:${tenantId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      totalGroups,
      monthlyRevenue,
      overduePayments,
      todayAttendance,
      recentStudents,
    ] = await Promise.all([
      this.prisma.student.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.student.count({
        where: { tenantId, status: StudentStatus.ACTIVE, deletedAt: null },
      }),
      this.prisma.teacher.count({ where: { tenantId, isActive: true } }),
      this.prisma.group.count({ where: { tenantId, isActive: true } }),
      this.prisma.payment.aggregate({
        where: { tenantId, status: PaymentStatus.PAID, month: thisMonth, year: thisYear },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payment.count({
        where: { tenantId, status: PaymentStatus.OVERDUE },
      }),
      this.prisma.attendance.count({
        where: {
          group: { tenantId },
          date: { gte: todayStart, lte: todayEnd },
        },
      }),
      this.prisma.student.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

    const stats = {
      students: {
        total: totalStudents,
        active: activeStudents,
        inactive: totalStudents - activeStudents,
      },
      teachers: { total: totalTeachers },
      groups: { total: totalGroups },
      revenue: {
        thisMonth: Number(monthlyRevenue._sum.amount || 0),
        thisMonthCount: monthlyRevenue._count,
      },
      payments: { overdue: overduePayments },
      attendance: { today: todayAttendance },
      recentStudents,
      generatedAt: new Date().toISOString(),
    };

    // Cache for 5 minutes
    await this.redis.set(cacheKey, stats, 300);
    return stats;
  }

  // ── Monthly growth chart ──────────────────────────────────
  async getGrowthChart(tenantId: string, year: number) {
    const cacheKey = `growth:${tenantId}:${year}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const data = await Promise.all(
      months.map(async (month) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const [newStudents, revenue, attendanceRate] = await Promise.all([
          this.prisma.student.count({
            where: {
              tenantId,
              joinedDate: { gte: startDate, lte: endDate },
            },
          }),
          this.prisma.payment.aggregate({
            where: {
              tenantId,
              status: PaymentStatus.PAID,
              month,
              year,
            },
            _sum: { amount: true },
          }),
          this.getMonthlyAttendanceRate(tenantId, month, year),
        ]);

        return {
          month,
          newStudents,
          revenue: Number(revenue._sum.amount || 0),
          attendanceRate,
        };
      }),
    );

    await this.redis.set(cacheKey, data, 3600); // Cache 1 hour
    return data;
  }

  // ── Best teachers (by attendance rate) ───────────────────
  async getTopTeachers(tenantId: string) {
    const teachers = await this.prisma.teacher.findMany({
      where: { tenantId, isActive: true },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
        groups: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            _count: { select: { students: true } },
          },
        },
      },
    });

    return teachers.map((t) => ({
      id: t.id,
      name: `${t.user.firstName} ${t.user.lastName}`,
      avatar: t.user.avatar,
      groups: t.groups.length,
      students: t.groups.reduce((sum, g) => sum + g._count.students, 0),
    }));
  }

  // ── Private helpers ───────────────────────────────────────
  private async getMonthlyAttendanceRate(
    tenantId: string,
    month: number,
    year: number,
  ): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const [total, present] = await Promise.all([
      this.prisma.attendance.count({
        where: { group: { tenantId }, date: { gte: startDate, lte: endDate } },
      }),
      this.prisma.attendance.count({
        where: {
          group: { tenantId },
          date: { gte: startDate, lte: endDate },
          status: AttendanceStatus.PRESENT,
        },
      }),
    ]);

    return total > 0 ? Math.round((present / total) * 100) : 0;
  }

  // ── CRON: Invalidate dashboard cache every 10 min ────────
  @Cron('*/10 * * * *')
  async invalidateDashboardCache() {
    await this.redis.delPattern('dashboard:*');
  }
}
