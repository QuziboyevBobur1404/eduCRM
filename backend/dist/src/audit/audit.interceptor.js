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
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_1 = require("./audit.service");
let AuditInterceptor = class AuditInterceptor {
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, ip, headers } = request;
        if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            if (!user?.id)
                return;
            const parts = url.split('/').filter(Boolean);
            const entityType = parts[1]
                ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1, -1)
                : 'Unknown';
            const entityId = response?.id || parts[2] || 'unknown';
            const actionMap = {
                POST: `${entityType.toLowerCase()}.create`,
                PATCH: `${entityType.toLowerCase()}.update`,
                PUT: `${entityType.toLowerCase()}.update`,
                DELETE: `${entityType.toLowerCase()}.delete`,
            };
            await this.auditService.log({
                userId: user.id,
                tenantId: user.tenantId,
                action: actionMap[method] || method.toLowerCase(),
                entityType,
                entityId,
                ipAddress: ip,
                userAgent: headers['user-agent'],
            });
        }));
    }
};
exports.AuditInterceptor = AuditInterceptor;
exports.AuditInterceptor = AuditInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditInterceptor);
//# sourceMappingURL=audit.interceptor.js.map