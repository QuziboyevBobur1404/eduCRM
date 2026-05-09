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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let CoursesService = class CoursesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId) {
        const existing = await this.prisma.course.findFirst({
            where: { name: dto.name, tenantId, deletedAt: null },
        });
        if (existing)
            throw new common_1.BadRequestException('Bu nomli kurs allaqachon mavjud');
        return this.prisma.course.create({ data: { ...dto, tenantId } });
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 20, search, isActive } = filters;
        const where = {
            tenantId,
            deletedAt: null,
            ...(isActive !== undefined && { isActive }),
            ...(search && { name: { contains: search, mode: 'insensitive' } }),
        };
        const [data, total] = await Promise.all([
            this.prisma.course.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { groups: { where: { isActive: true, deletedAt: null } } },
                    },
                },
            }),
            this.prisma.course.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
        const course = await this.prisma.course.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                groups: {
                    where: { isActive: true, deletedAt: null },
                    include: {
                        teacher: {
                            include: {
                                user: { select: { firstName: true, lastName: true } },
                            },
                        },
                        _count: { select: { students: { where: { isActive: true } } } },
                    },
                },
                _count: { select: { groups: true } },
            },
        });
        if (!course)
            throw new common_1.NotFoundException('Kurs topilmadi');
        const groupIds = course.groups.map((g) => g.id);
        let totalRevenue = 0;
        if (groupIds.length > 0) {
            const revenue = await this.prisma.payment.aggregate({
                where: { groupId: { in: groupIds }, status: 'PAID' },
                _sum: { amount: true },
            });
            totalRevenue = Number(revenue._sum.amount || 0);
        }
        return {
            ...course,
            stats: {
                activeGroups: course.groups.length,
                totalStudents: course.groups.reduce((sum, g) => sum + g._count.students, 0),
                totalRevenue,
            },
        };
    }
    async update(id, dto, tenantId) {
        await this.findOne(id, tenantId);
        return this.prisma.course.update({ where: { id }, data: dto });
    }
    async remove(id, tenantId) {
        const course = await this.findOne(id, tenantId);
        if ((course.groups?.length || 0) > 0) {
            throw new common_1.BadRequestException(`Bu kursda ${course.groups.length} ta faol guruh bor. Avval guruhlarni o'chiring.`);
        }
        await this.prisma.course.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: "Kurs o'chirildi" };
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoursesService);
//# sourceMappingURL=courses.service.js.map