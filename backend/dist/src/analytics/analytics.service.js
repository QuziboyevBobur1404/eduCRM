"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const index_1 = require("../common/enums/index");
let AnalyticsService = class AnalyticsService {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async getDashboardStats(tenantId) {
        const cacheKey = `dashboard:${tenantId}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return cached;
        const now = new Date();
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));
        const [totalStudents, activeStudents, totalTeachers, totalGroups, monthlyRevenue, overduePayments, todayAttendance, recentStudents,] = await Promise.all([
            this.prisma.student.count({ where: { tenantId, deletedAt: null } }),
            this.prisma.student.count({
                where: { tenantId, status: index_1.StudentStatus.ACTIVE, deletedAt: null },
            }),
            this.prisma.teacher.count({ where: { tenantId, isActive: true } }),
            this.prisma.group.count({ where: { tenantId, isActive: true } }),
            this.prisma.payment.aggregate({
                where: { tenantId, status: index_1.PaymentStatus.PAID, month: thisMonth, year: thisYear },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.payment.count({
                where: { tenantId, status: index_1.PaymentStatus.OVERDUE },
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
        await this.redis.set(cacheKey, stats, 300);
        return stats;
    }
    async getGrowthChart(tenantId, year) {
        const cacheKey = `growth:${tenantId}:${year}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return cached;
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const data = await Promise.all(months.map(async (month) => {
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
                        status: index_1.PaymentStatus.PAID,
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
        }));
        await this.redis.set(cacheKey, data, 3600);
        return data;
    }
    async getTopTeachers(tenantId) {
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
    async getMonthlyAttendanceRate(tenantId, month, year) {
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
                    status: index_1.AttendanceStatus.PRESENT,
                },
            }),
        ]);
        return total > 0 ? Math.round((present / total) * 100) : 0;
    }
    async invalidateDashboardCache() {
        await this.redis.delPattern('dashboard:*');
    }
};
exports.AnalyticsService = AnalyticsService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsService.prototype, "invalidateDashboardCache", null);
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map