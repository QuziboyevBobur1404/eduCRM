"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const app_gateway_1 = require("../gateway/app.gateway");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const index_1 = require("../common/enums/index");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, gateway, config) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.config = config;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async create(dto) {
        const notification = await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                channel: dto.channel || index_1.NotificationChannel.IN_APP,
                title: dto.title,
                body: dto.body,
                data: dto.data ?? {},
            },
        });
        this.gateway.sendNotificationToUser(dto.userId, notification);
        return notification;
    }
    async notifyAdmins(tenantId, type, title, body, data) {
        const admins = await this.prisma.user.findMany({
            where: {
                tenantId,
                role: { in: ['SUPER_ADMIN', 'ADMIN'] },
                isActive: true,
                deletedAt: null,
            },
            select: { id: true },
        });
        await Promise.all(admins.map((admin) => this.create({ userId: admin.id, type, title, body, data })));
    }
    async findAll(userId, page = 1, limit = 20, onlyUnread = false) {
        const where = {
            userId,
            ...(onlyUnread && { isRead: false }),
        };
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.notification.count({ where }),
        ]);
        const unreadCount = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });
        return { ...new pagination_dto_1.PaginatedResult(data, total, page, limit), unreadCount };
    }
    async markRead(id, userId) {
        return this.prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async markAllRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({ where: { userId, isRead: false } });
    }
    async sendEmail(to, subject, html) {
        const smtpUser = this.config.get('SMTP_USER');
        if (!smtpUser) {
            this.logger.warn('SMTP not configured — skipping email');
            return;
        }
        try {
            const nodemailer = await Promise.resolve().then(() => __importStar(require('nodemailer'))).catch(() => null);
            if (!nodemailer) {
                this.logger.warn('nodemailer not installed — skipping email');
                return;
            }
            const transporter = nodemailer.createTransport({
                host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
                port: this.config.get('SMTP_PORT', 587),
                secure: false,
                auth: {
                    user: smtpUser,
                    pass: this.config.get('SMTP_PASS'),
                },
            });
            await transporter.sendMail({
                from: this.config.get('SMTP_FROM', 'EduCRM <no-reply@educrm.uz>'),
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to: ${to}`);
        }
        catch (err) {
            this.logger.error(`Email failed to ${to}: ${err.message}`);
        }
    }
    async onStudentCreated(payload) {
        await this.notifyAdmins(payload.tenantId, index_1.NotificationType.NEW_STUDENT, "Yangi o'quvchi qo'shildi", `${payload.student.firstName} ${payload.student.lastName} tizimga qo'shildi`, { studentId: payload.student.id });
    }
    async onStudentInactivated(payload) {
        const student = await this.prisma.student.findUnique({
            where: { id: payload.studentId },
        });
        if (!student)
            return;
        await this.notifyAdmins(student.tenantId, index_1.NotificationType.STUDENT_INACTIVE, "O'quvchi avtomatik nofaolga o'tkazildi", `${student.firstName} ${student.lastName} — 10+ dars o'tkazildi`, { studentId: student.id });
    }
    async onAbsenceLimit(payload) {
        const student = await this.prisma.student.findUnique({
            where: { id: payload.studentId },
            select: { firstName: true, lastName: true },
        });
        if (!student)
            return;
        await this.notifyAdmins(payload.tenantId, index_1.NotificationType.ATTENDANCE_ALERT, 'Davomat ogohlantirishi', `${student.firstName} ${student.lastName} ${payload.absenceCount} ta darsni o'tkazib yubordi`, { studentId: payload.studentId });
    }
    onPaymentOverdue(payload) {
        this.logger.warn(`${payload.count} ta to'lov muddati o'tdi`);
    }
    async onPaymentReminders(payload) {
        for (const payment of payload.payments) {
            if (!payment.tenantId)
                continue;
            const admins = await this.prisma.user.findMany({
                where: {
                    tenantId: payment.tenantId,
                    role: { in: ['ADMIN', 'SUPER_ADMIN'] },
                    isActive: true,
                },
                select: { id: true },
            });
            for (const admin of admins) {
                await this.create({
                    userId: admin.id,
                    type: index_1.NotificationType.PAYMENT_DUE,
                    title: "To'lov muddati yaqinlashmoqda",
                    body: `${payment.student?.firstName ?? ''} ${payment.student?.lastName ?? ''} — ${payment.amount} UZS`,
                    data: { paymentId: payment.id, studentId: payment.studentId },
                });
            }
        }
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, event_emitter_1.OnEvent)('student.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "onStudentCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('student.auto_inactivated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "onStudentInactivated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('student.absence_limit_exceeded'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "onAbsenceLimit", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.bulk_overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsService.prototype, "onPaymentOverdue", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.reminders_due'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "onPaymentReminders", null);
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_gateway_1.AppGateway,
        config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map