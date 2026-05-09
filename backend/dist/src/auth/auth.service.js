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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const index_1 = require("../common/enums/index");
let AuthService = class AuthService {
    constructor(prisma, redis, jwt, config) {
        this.prisma = prisma;
        this.redis = redis;
        this.jwt = jwt;
        this.config = config;
    }
    async login(dto, ip) {
        const user = await this.prisma.user.findFirst({
            where: { email: dto.email, deletedAt: null },
            include: { teacher: { select: { id: true } } },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Hisobingiz bloklangan. Admin bilan bog\'laning');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role, user.tenantId);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                tenantId: user.tenantId,
                avatar: user.avatar,
                teacherId: user.teacher?.id || null,
            },
            ...tokens,
        };
    }
    async register(dto, tenantId) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                role: dto.role || index_1.Role.TEACHER,
                tenantId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                tenantId: true,
                createdAt: true,
            },
        });
        return user;
    }
    async refreshTokens(userId, refreshToken) {
        const storedToken = await this.redis.getRefreshToken(userId);
        if (!storedToken || storedToken !== refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token yaroqsiz yoki muddati o\'tgan');
        }
        const user = await this.prisma.user.findFirst({
            where: { id: userId, isActive: true, deletedAt: null },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Foydalanuvchi topilmadi');
        }
        return this.generateTokens(user.id, user.email, user.role, user.tenantId);
    }
    async logout(userId) {
        await this.redis.deleteRefreshToken(userId);
        return { message: 'Muvaffaqiyatli chiqildi' };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
                role: true,
                tenantId: true,
                lastLoginAt: true,
                createdAt: true,
                teacher: {
                    select: {
                        id: true,
                        speciality: true,
                        bio: true,
                    },
                },
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        plan: true,
                        logoUrl: true,
                        primaryColor: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        return user;
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        const isValid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!isValid) {
            throw new common_1.BadRequestException('Joriy parol noto\'g\'ri');
        }
        const hashedNew = await bcrypt.hash(dto.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNew },
        });
        await this.redis.deleteRefreshToken(userId);
        return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
    }
    async generateTokens(userId, email, role, tenantId) {
        const payload = { sub: userId, email, role, tenantId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        await this.redis.setRefreshToken(userId, refreshToken, 604800);
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map