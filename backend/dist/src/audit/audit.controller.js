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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_service_1 = require("./audit.service");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    findAll(tenantId, page, limit, userId, entityType, action, from, to) {
        return this.auditService.findAll(tenantId, page, limit, {
            userId, entityType, action, from, to,
        });
    }
    getEntityHistory(entityType, entityId, tenantId) {
        return this.auditService.getEntityHistory(entityType, entityId, tenantId);
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('audit.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha audit loglari' }),
    __param(0, (0, index_2.TenantId)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('userId')),
    __param(4, (0, common_1.Query)('entityType')),
    __param(5, (0, common_1.Query)('action')),
    __param(6, (0, common_1.Query)('from')),
    __param(7, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':entityType/:entityId'),
    (0, index_2.Permissions)('audit.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Entity tarixi' }),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId', common_1.ParseUUIDPipe)),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "getEntityHistory", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('Audit'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map