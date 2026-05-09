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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const filter_payment_dto_1 = require("./dto/filter-payment.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    create(dto, tenantId, userId) {
        return this.paymentsService.create(dto, tenantId, userId);
    }
    findAll(filters, tenantId) {
        return this.paymentsService.findAll(filters, tenantId);
    }
    getOverdue(tenantId) {
        return this.paymentsService.getOverdue(tenantId);
    }
    getAnalytics(tenantId, year) {
        return this.paymentsService.getAnalytics(tenantId, year || new Date().getFullYear());
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('payment.create'),
    (0, swagger_1.ApiOperation)({ summary: "To'lov qabul qilish" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __param(2, (0, index_2.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('payment.read'),
    (0, swagger_1.ApiOperation)({ summary: "To'lovlar ro'yxati" }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_payment_dto_1.FilterPaymentDto, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('overdue'),
    (0, index_2.Permissions)('payment.read'),
    (0, swagger_1.ApiOperation)({ summary: "Muddati o'tgan to'lovlar (qarzdorlar)" }),
    __param(0, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getOverdue", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, index_2.Permissions)('payment.read'),
    (0, swagger_1.ApiOperation)({ summary: "To'lov analitikasi" }),
    __param(0, (0, index_2.TenantId)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getAnalytics", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map