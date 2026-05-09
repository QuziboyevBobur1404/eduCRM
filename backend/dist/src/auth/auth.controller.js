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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const index_1 = require("./dto/index");
const index_2 = require("../common/guards/index");
const index_3 = require("../common/decorators/index");
const index_4 = require("../common/enums/index");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto, req, res) {
        const result = await this.authService.login(dto, req.ip);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth/refresh',
        });
        return {
            user: result.user,
            accessToken: result.accessToken,
        };
    }
    async register(dto, tenantId) {
        return this.authService.register(dto, tenantId);
    }
    async refresh(req, res) {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token topilmadi' });
        }
        const payload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
        const tokens = await this.authService.refreshTokens(payload.sub, refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth/refresh',
        });
        return { accessToken: tokens.accessToken };
    }
    async logout(userId, res) {
        res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
        return this.authService.logout(userId);
    }
    async getMe(userId) {
        return this.authService.getMe(userId);
    }
    async changePassword(userId, dto) {
        return this.authService.changePassword(userId, dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, index_3.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Tizimga kirish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(index_2.JwtAuthGuard),
    (0, index_3.Roles)(index_4.Role.SUPER_ADMIN, index_4.Role.ADMIN),
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi foydalanuvchi qo\'shish (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_3.CurrentUser)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.RegisterDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, index_3.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Access tokenni yangilash' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)(index_2.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Tizimdan chiqish' }),
    __param(0, (0, index_3.CurrentUser)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(index_2.JwtAuthGuard),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Joriy foydalanuvchi ma\'lumotlari' }),
    __param(0, (0, index_3.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(index_2.JwtAuthGuard),
    (0, common_1.Put)('change-password'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Parolni o\'zgartirish' }),
    __param(0, (0, index_3.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, index_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map