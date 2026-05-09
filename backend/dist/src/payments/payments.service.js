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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const index_1 = require("../common/enums/index");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let PaymentsService = class PaymentsService {
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async create(dto, tenantId, createdById) {
        const dueDate = new Date(dto.year, dto.month - 1, 10);
        const existing = await this.prisma.payment.findFirst({
            where: {
                studentId: dto.studentId,
                groupId: dto.groupId,
                month: dto.month,
                year: dto.year,
                tenantId,
            },
        });
        const payment = existing
            ? await this.prisma.payment.update({
                where: { id: existing.id },
                data: {
                    amount: dto.amount,
                    method: dto.method,
                    status: index_1.PaymentStatus.PAID,
                    paidAt: new Date(),
                    notes: dto.notes,
                },
            })
            : await this.prisma.payment.create({
                data: {
                    studentId: dto.studentId,
                    groupId: dto.groupId,
                    amount: dto.amount,
                    method: dto.method,
                    status: index_1.PaymentStatus.PAID,
                    month: dto.month,
                    year: dto.year,
                    dueDate,
                    paidAt: new Date(),
                    notes: dto.notes,
                    tenantId,
                    createdById,
                },
            });
        this.events.emit('payment.received', { payment, tenantId });
        return payment;
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 20, status, studentId, month, year, groupId } = filters;
        const where = {
            tenantId,
            ...(status && { status }),
            ...(studentId && { studentId }),
            ...(month && { month: Number(month) }),
            ...(year && { year: Number(year) }),
            ...(groupId && { groupId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ year: 'desc' }, { month: 'desc' }],
                include: {
                    student: {
                        select: {
                            id: true, firstName: true, lastName: true,
                            phone: true, avatar: true,
                        },
                    },
                },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getOverdue(tenantId) {
        return this.prisma.payment.findMany({
            where: { tenantId, status: index_1.PaymentStatus.OVERDUE },
            include: {
                student: {
                    select: {
                        id: true, firstName: true, lastName: true,
                        phone: true, parentPhone: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
        });
    }
    async getAnalytics(tenantId, year) {
        const monthlyRevenue = await this.prisma.payment.groupBy({
            by: ['month'],
            where: { tenantId, status: index_1.PaymentStatus.PAID, year },
            _sum: { amount: true },
            _count: true,
            orderBy: { month: 'asc' },
        });
        const statusSummary = await this.prisma.payment.groupBy({
            by: ['status'],
            where: { tenantId, year },
            _sum: { amount: true },
            _count: true,
        });
        const now = new Date();
        const thisMonth = await this.prisma.payment.aggregate({
            where: {
                tenantId,
                status: index_1.PaymentStatus.PAID,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            },
            _sum: { amount: true },
            _count: true,
        });
        return {
            monthlyRevenue: monthlyRevenue.map((m) => ({
                month: m.month,
                total: Number(m._sum.amount || 0),
                count: m._count,
            })),
            statusSummary: Object.fromEntries(statusSummary.map((s) => [
                s.status,
                { total: Number(s._sum.amount || 0), count: s._count },
            ])),
            thisMonth: {
                total: Number(thisMonth._sum.amount || 0),
                count: thisMonth._count,
            },
        };
    }
    async checkOverduePayments() {
        const result = await this.prisma.payment.updateMany({
            where: { status: index_1.PaymentStatus.PENDING, dueDate: { lt: new Date() } },
            data: { status: index_1.PaymentStatus.OVERDUE },
        });
        if (result.count > 0) {
            this.events.emit('payment.bulk_overdue', { count: result.count });
        }
        return result.count;
    }
    async autoCreateMonthlyPayments() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const dueDate = new Date(year, month - 1, 10);
        const activeGroupStudents = await this.prisma.groupStudent.findMany({
            where: { isActive: true },
            include: {
                group: { include: { course: { select: { monthlyPrice: true } } } },
            },
        });
        let created = 0;
        for (const gs of activeGroupStudents) {
            const exists = await this.prisma.payment.findFirst({
                where: { studentId: gs.studentId, groupId: gs.groupId, month, year },
            });
            if (!exists) {
                await this.prisma.payment.create({
                    data: {
                        studentId: gs.studentId,
                        groupId: gs.groupId,
                        amount: gs.group.course.monthlyPrice,
                        status: index_1.PaymentStatus.PENDING,
                        month,
                        year,
                        dueDate,
                        tenantId: gs.group.tenantId,
                    },
                });
                created++;
            }
        }
        this.events.emit('payment.monthly_created', { count: created, month, year });
        return created;
    }
    async sendPaymentReminders() {
        const now = new Date();
        const pending = await this.prisma.payment.findMany({
            where: {
                status: index_1.PaymentStatus.PENDING,
                month: now.getMonth() + 1,
                year: now.getFullYear(),
            },
            include: {
                student: { select: { id: true, firstName: true, lastName: true, phone: true } },
            },
        });
        this.events.emit('payment.reminders_due', { payments: pending });
        return pending.length;
    }
};
exports.PaymentsService = PaymentsService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *', { name: 'check-overdue-payments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "checkOverduePayments", null);
__decorate([
    (0, schedule_1.Cron)('0 8 1 * *', { name: 'auto-create-monthly-payments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "autoCreateMonthlyPayments", null);
__decorate([
    (0, schedule_1.Cron)('0 9 7 * *', { name: 'payment-reminders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "sendPaymentReminders", null);
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map