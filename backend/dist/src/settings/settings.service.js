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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(tenantId, key) {
        const setting = await this.prisma.setting.findUnique({
            where: { tenantId_key: { tenantId, key } },
        });
        return setting ? setting.value : null;
    }
    async getAll(tenantId) {
        const settings = await this.prisma.setting.findMany({
            where: { tenantId },
            orderBy: { key: 'asc' },
        });
        return Object.fromEntries(settings.map((s) => [s.key, s.value]));
    }
    async set(tenantId, key, value) {
        return this.prisma.setting.upsert({
            where: { tenantId_key: { tenantId, key } },
            create: { tenantId, key, value },
            update: { value },
        });
    }
    async setMany(tenantId, data) {
        const results = await Promise.all(Object.entries(data).map(([key, value]) => this.set(tenantId, key, value)));
        return { updated: results.length };
    }
    async delete(tenantId, key) {
        await this.prisma.setting.deleteMany({
            where: { tenantId, key },
        });
        return { message: 'Sozlama o\'chirildi' };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map