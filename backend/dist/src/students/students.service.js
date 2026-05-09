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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const index_1 = require("../common/enums/index");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let StudentsService = class StudentsService {
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async create(dto, tenantId, createdById) {
        const existing = await this.prisma.student.findFirst({
            where: { phone: dto.phone, tenantId, deletedAt: null },
        });
        if (existing) {
            throw new common_1.BadRequestException("Bu telefon raqam allaqachon ro'yxatda bor");
        }
        const student = await this.prisma.student.create({
            data: {
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                tenantId,
                createdById,
            },
        });
        this.events.emit('student.created', { student, tenantId });
        return student;
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 20, search, status, gender, groupId, sortBy, sortOrder, } = filters;
        const where = {
            tenantId,
            deletedAt: null,
            ...(status && { status }),
            ...(gender && { gender }),
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } },
                ],
            }),
            ...(groupId && {
                groupStudents: { some: { groupId, isActive: true } },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
                select: {
                    id: true, firstName: true, lastName: true,
                    phone: true, parentPhone: true, avatar: true,
                    gender: true, status: true, joinedDate: true, createdAt: true,
                    groupStudents: {
                        where: { isActive: true },
                        select: {
                            group: {
                                select: {
                                    id: true, name: true,
                                    course: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.student.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
        const student = await this.prisma.student.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                groupStudents: {
                    where: { isActive: true },
                    include: {
                        group: {
                            include: {
                                course: true,
                                teacher: {
                                    include: {
                                        user: { select: { firstName: true, lastName: true } },
                                    },
                                },
                                schedules: true,
                            },
                        },
                    },
                },
            },
        });
        if (!student)
            throw new common_1.NotFoundException("O'quvchi topilmadi");
        return student;
    }
    async update(id, dto, tenantId, updatedById) {
        const before = await this.findOne(id, tenantId);
        const updated = await this.prisma.student.update({
            where: { id },
            data: {
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            },
        });
        this.events.emit('student.updated', {
            before,
            after: updated,
            userId: updatedById,
            tenantId,
        });
        return updated;
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.student.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return { message: "O'quvchi o'chirildi" };
    }
    async getAttendanceHistory(id, tenantId, query) {
        await this.findOne(id, tenantId);
        const { from, to, groupId, page = 1, limit = 30 } = query;
        const where = {
            studentId: id,
            ...(from && to && { date: { gte: new Date(from), lte: new Date(to) } }),
            ...(groupId && { groupId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.attendance.findMany({
                where,
                skip: (page - 1) * limit,
                take: +limit,
                orderBy: { date: 'desc' },
                include: { group: { select: { id: true, name: true } } },
            }),
            this.prisma.attendance.count({ where }),
        ]);
        const stats = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: { studentId: id },
            _count: true,
        });
        return {
            data,
            meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) },
            stats: Object.fromEntries(stats.map((s) => [s.status, s._count])),
        };
    }
    async getPaymentHistory(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.payment.findMany({
            where: { studentId: id, tenantId },
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
    }
    async getExamHistory(id, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.examResult.findMany({
            where: { studentId: id },
            include: {
                exam: {
                    include: { group: { select: { name: true } } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async autoInactivateByAbsences() {
        const studentsToInactivate = await this.prisma.$queryRaw `
      SELECT "studentId"
      FROM attendances
      WHERE status = 'ABSENT'
      GROUP BY "studentId"
      HAVING COUNT(*) > 10
    `;
        if (studentsToInactivate.length === 0)
            return 0;
        const ids = studentsToInactivate.map((s) => s.studentId);
        const result = await this.prisma.student.updateMany({
            where: { id: { in: ids }, status: index_1.StudentStatus.ACTIVE },
            data: { status: index_1.StudentStatus.INACTIVE },
        });
        for (const { studentId } of studentsToInactivate) {
            this.events.emit('student.auto_inactivated', { studentId });
        }
        return result.count;
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], StudentsService);
//# sourceMappingURL=students.service.js.map