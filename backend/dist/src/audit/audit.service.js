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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AuditService = class AuditService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(dto) {
        return this.prisma.activityLog.create({
            data: {
                userId: dto.userId,
                tenantId: dto.tenantId,
                action: dto.action,
                entityType: dto.entityType,
                entityId: dto.entityId,
                changes: dto.changes,
                ipAddress: dto.ipAddress,
                userAgent: dto.userAgent,
            },
        });
    }
    async findAll(tenantId, page = 1, limit = 50, filters) {
        const where = {
            tenantId,
            ...(filters?.userId && { userId: filters.userId }),
            ...(filters?.entityType && { entityType: filters.entityType }),
            ...(filters?.action && { action: { contains: filters.action } }),
            ...(filters?.from && filters?.to && {
                createdAt: { gte: new Date(filters.from), lte: new Date(filters.to) },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.activityLog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true, firstName: true, lastName: true,
                            email: true, role: true, avatar: true,
                        },
                    },
                },
            }),
            this.prisma.activityLog.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getEntityHistory(entityType, entityId, tenantId) {
        return this.prisma.activityLog.findMany({
            where: { entityType, entityId, tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, firstName: true, lastName: true, role: true },
                },
            },
        });
    }
    async onStudentUpdated(payload) {
        await this.log({
            userId: payload.userId,
            tenantId: payload.tenantId,
            action: 'student.update',
            entityType: 'Student',
            entityId: payload.after.id,
            changes: { before: payload.before, after: payload.after },
        });
    }
    async onPaymentReceived(payload) {
        await this.log({
            userId: payload.payment.createdById || 'system',
            tenantId: payload.tenantId,
            action: 'payment.create',
            entityType: 'Payment',
            entityId: payload.payment.id,
            changes: { after: payload.payment },
        });
    }
};
exports.AuditService = AuditService;
__decorate([
    (0, event_emitter_1.OnEvent)('student.updated'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditService.prototype, "onStudentUpdated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('payment.received'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditService.prototype, "onPaymentReceived", null);
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map