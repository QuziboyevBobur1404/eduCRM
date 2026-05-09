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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let GroupsService = class GroupsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const [course, teacher] = await Promise.all([
            this.prisma.course.findFirst({ where: { id: dto.courseId, tenantId } }),
            this.prisma.teacher.findFirst({ where: { id: dto.teacherId, tenantId } }),
        ]);
        if (!course)
            throw new common_1.BadRequestException('Kurs topilmadi');
        if (!teacher)
            throw new common_1.BadRequestException("O'qituvchi topilmadi");
        return this.prisma.group.create({
            data: {
                name: dto.name,
                courseId: dto.courseId,
                teacherId: dto.teacherId,
                capacity: dto.capacity ?? 15,
                roomNumber: dto.roomNumber,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                tenantId,
            },
            include: {
                course: { select: { id: true, name: true, monthlyPrice: true } },
                teacher: {
                    include: {
                        user: { select: { firstName: true, lastName: true, avatar: true } },
                    },
                },
            },
        });
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 20, search, courseId, teacherId, isActive } = filters;
        const where = {
            tenantId,
            deletedAt: null,
            ...(isActive !== undefined && { isActive }),
            ...(courseId && { courseId }),
            ...(teacherId && { teacherId }),
            ...(search && { name: { contains: search, mode: 'insensitive' } }),
        };
        const [data, total] = await Promise.all([
            this.prisma.group.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    course: { select: { id: true, name: true, monthlyPrice: true } },
                    teacher: {
                        include: {
                            user: { select: { firstName: true, lastName: true, avatar: true } },
                        },
                    },
                    schedules: true,
                    _count: {
                        select: { students: { where: { isActive: true } } },
                    },
                },
            }),
            this.prisma.group.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
        const group = await this.prisma.group.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                course: true,
                teacher: {
                    include: {
                        user: {
                            select: {
                                firstName: true, lastName: true,
                                email: true, avatar: true, phone: true,
                            },
                        },
                    },
                },
                schedules: { orderBy: { dayOfWeek: 'asc' } },
                students: {
                    where: { isActive: true },
                    include: {
                        student: {
                            select: {
                                id: true, firstName: true, lastName: true,
                                phone: true, avatar: true, status: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: { where: { isActive: true } },
                        attendances: true,
                        exams: true,
                    },
                },
            },
        });
        if (!group)
            throw new common_1.NotFoundException('Guruh topilmadi');
        return group;
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        if (dto.teacherId) {
            const teacher = await this.prisma.teacher.findFirst({
                where: { id: dto.teacherId, tenantId },
            });
            if (!teacher)
                throw new common_1.BadRequestException("O'qituvchi topilmadi");
        }
        return this.prisma.group.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.teacherId && { teacherId: dto.teacherId }),
                ...(dto.capacity && { capacity: dto.capacity }),
                ...(dto.roomNumber !== undefined && { roomNumber: dto.roomNumber }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
            include: {
                course: { select: { id: true, name: true } },
                teacher: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });
    }
    async addStudents(id, dto, tenantId) {
        const group = await this.findOne(id, tenantId);
        const currentCount = await this.prisma.groupStudent.count({
            where: { groupId: id, isActive: true },
        });
        if (currentCount + dto.studentIds.length > group.capacity) {
            throw new common_1.BadRequestException(`Guruh sig'imi to'lgan. Maksimal: ${group.capacity}, Hozirgi: ${currentCount}`);
        }
        const results = await Promise.all(dto.studentIds.map((studentId) => this.prisma.groupStudent.upsert({
            where: { groupId_studentId: { groupId: id, studentId } },
            create: { groupId: id, studentId },
            update: { isActive: true, leftAt: null },
        })));
        return { message: `${results.length} ta o'quvchi guruhga qo'shildi` };
    }
    async removeStudent(groupId, studentId, tenantId) {
        await this.findOne(groupId, tenantId);
        await this.prisma.groupStudent.update({
            where: { groupId_studentId: { groupId, studentId } },
            data: { isActive: false, leftAt: new Date() },
        });
        return { message: "O'quvchi guruhdan chiqarildi" };
    }
    async setSchedules(id, schedules, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.schedule.deleteMany({ where: { groupId: id } });
        await this.prisma.schedule.createMany({
            data: schedules.map((s) => ({ ...s, groupId: id })),
        });
        return this.prisma.schedule.findMany({
            where: { groupId: id },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    async getStats(id, tenantId) {
        await this.findOne(id, tenantId);
        const now = new Date();
        const [totalStudents, attendanceTotal, attendancePresent, monthlyRevenue, pendingPayments] = await Promise.all([
            this.prisma.groupStudent.count({ where: { groupId: id, isActive: true } }),
            this.prisma.attendance.count({ where: { groupId: id } }),
            this.prisma.attendance.count({ where: { groupId: id, status: 'PRESENT' } }),
            this.prisma.payment.aggregate({
                where: {
                    groupId: id,
                    status: 'PAID',
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                },
                _sum: { amount: true },
            }),
            this.prisma.payment.count({
                where: { groupId: id, status: { in: ['PENDING', 'OVERDUE'] } },
            }),
        ]);
        return {
            totalStudents,
            attendanceRate: attendanceTotal > 0
                ? ((attendancePresent / attendanceTotal) * 100).toFixed(1)
                : '0',
            monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
            pendingPayments,
        };
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.group.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        return { message: "Guruh o'chirildi" };
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map