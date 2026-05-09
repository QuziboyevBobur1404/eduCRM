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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId, page = 1, limit = 20, role) {
        const where = {
            tenantId,
            deletedAt: null,
            ...(role && { role }),
        };
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, email: true, firstName: true, lastName: true,
                    phone: true, avatar: true, role: true, isActive: true,
                    lastLoginAt: true, createdAt: true,
                    teacher: { select: { id: true, speciality: true } },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
        const user = await this.prisma.user.findFirst({
            where: { id, tenantId, deletedAt: null },
            select: {
                id: true, email: true, firstName: true, lastName: true,
                phone: true, avatar: true, role: true, isActive: true,
                lastLoginAt: true, createdAt: true,
                teacher: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        return user;
    }
    async updateProfile(id, tenantId, data) {
        await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: {
                ...(data.firstName && { firstName: data.firstName }),
                ...(data.lastName && { lastName: data.lastName }),
                ...(data.phone && { phone: data.phone }),
            },
            select: {
                id: true, email: true, firstName: true,
                lastName: true, phone: true, avatar: true, role: true,
            },
        });
    }
    async toggleActive(id, tenantId) {
        const user = await this.findOne(id, tenantId);
        return this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, isActive: true },
        });
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        return { message: "Foydalanuvchi o'chirildi" };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map