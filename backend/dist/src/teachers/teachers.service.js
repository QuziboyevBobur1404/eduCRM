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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const index_1 = require("../common/enums/index");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let TeachersService = class TeachersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException("Bu email allaqachon ro'yxatdan o'tgan");
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                role: index_1.Role.TEACHER,
                tenantId,
            },
        });
        const teacher = await this.prisma.teacher.create({
            data: {
                userId: user.id,
                tenantId,
                speciality: dto.speciality,
                bio: dto.bio,
                salary: dto.salary,
            },
            include: {
                user: {
                    select: {
                        id: true, email: true, firstName: true,
                        lastName: true, phone: true, avatar: true,
                    },
                },
            },
        });
        return teacher;
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 20, search, isActive } = filters;
        const where = {
            tenantId,
            deletedAt: null,
            ...(isActive !== undefined && { isActive }),
            ...(search && {
                user: {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                },
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.teacher.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true, email: true, firstName: true,
                            lastName: true, phone: true, avatar: true,
                        },
                    },
                    _count: { select: { groups: true } },
                },
            }),
            this.prisma.teacher.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
        const teacher = await this.prisma.teacher.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                user: {
                    select: {
                        id: true, email: true, firstName: true, lastName: true,
                        phone: true, avatar: true, lastLoginAt: true,
                    },
                },
                groups: {
                    where: { isActive: true },
                    include: {
                        course: { select: { name: true } },
                        _count: { select: { students: true } },
                        schedules: true,
                    },
                },
            },
        });
        if (!teacher)
            throw new common_1.NotFoundException("O'qituvchi topilmadi");
        return teacher;
    }
    async update(id, dto, tenantId) {
        const teacher = await this.findOne(id, tenantId);
        const { firstName, lastName, phone, ...teacherData } = dto;
        if (firstName || lastName || phone) {
            await this.prisma.user.update({
                where: { id: teacher.user.id },
                data: {
                    ...(firstName && { firstName }),
                    ...(lastName && { lastName }),
                    ...(phone && { phone }),
                },
            });
        }
        return this.prisma.teacher.update({
            where: { id },
            data: teacherData,
            include: {
                user: {
                    select: {
                        id: true, email: true, firstName: true,
                        lastName: true, phone: true, avatar: true,
                    },
                },
            },
        });
    }
    async remove(id, tenantId) {
        const teacher = await this.findOne(id, tenantId);
        const activeGroups = await this.prisma.group.count({
            where: { teacherId: id, isActive: true },
        });
        if (activeGroups > 0) {
            throw new common_1.BadRequestException(`O'qituvchining ${activeGroups} ta faol guruhi bor. Avval guruhlarni boshqa o'qituvchiga o'tkazing`);
        }
        await this.prisma.teacher.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        await this.prisma.user.update({
            where: { id: teacher.user.id },
            data: { isActive: false },
        });
        return { message: "O'qituvchi o'chirildi" };
    }
    async getStats(id, tenantId) {
        await this.findOne(id, tenantId);
        const groups = await this.prisma.group.findMany({
            where: { teacherId: id, isActive: true },
            select: { id: true },
        });
        const groupIds = groups.map((g) => g.id);
        const [totalStudents, totalAttendance, presentCount] = await Promise.all([
            this.prisma.groupStudent.count({
                where: { groupId: { in: groupIds }, isActive: true },
            }),
            this.prisma.attendance.count({
                where: { groupId: { in: groupIds } },
            }),
            this.prisma.attendance.count({
                where: { groupId: { in: groupIds }, status: 'PRESENT' },
            }),
        ]);
        return {
            activeGroups: groups.length,
            totalStudents,
            attendanceRate: totalAttendance > 0
                ? ((presentCount / totalAttendance) * 100).toFixed(1)
                : '0',
        };
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map