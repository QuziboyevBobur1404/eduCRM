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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getDashboard(tenantId) {
        return this.analyticsService.getDashboardStats(tenantId);
    }
    getGrowth(tenantId, year) {
        return this.analyticsService.getGrowthChart(tenantId, year ? +year : new Date().getFullYear());
    }
    getTopTeachers(tenantId) {
        return this.analyticsService.getTopTeachers(tenantId);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, index_2.Permissions)('analytics.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Dashboard KPI widgetlari' }),
    __param(0, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('growth'),
    (0, index_2.Permissions)('analytics.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Oylik o\'sish grafigi' }),
    __param(0, (0, index_2.TenantId)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getGrowth", null);
__decorate([
    (0, common_1.Get)('teachers'),
    (0, index_2.Permissions)('analytics.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Eng faol o\'qituvchilar' }),
    __param(0, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "getTopTeachers", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map