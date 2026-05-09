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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("./settings.service");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
const index_3 = require("../common/enums/index");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getAll(tenantId) {
        return this.settingsService.getAll(tenantId);
    }
    get(key, tenantId) {
        return this.settingsService.get(tenantId, key);
    }
    set(key, body, tenantId) {
        return this.settingsService.set(tenantId, key, body.value);
    }
    setMany(data, tenantId) {
        return this.settingsService.setMany(tenantId, data);
    }
    delete(key, tenantId) {
        return this.settingsService.delete(tenantId, key);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha sozlamalar' }),
    __param(0, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Bitta sozlama' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Sozlamani yangilash yoki yaratish' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "set", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Ko\'p sozlamani bir vaqtda yangilash' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "setMany", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, swagger_1.ApiOperation)({ summary: 'Sozlamani o\'chirish' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "delete", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, index_2.Roles)(index_3.Role.SUPER_ADMIN, index_3.Role.ADMIN),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map