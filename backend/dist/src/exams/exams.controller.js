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
exports.ExamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exams_service_1 = require("./exams.service");
const create_exam_dto_1 = require("./dto/create-exam.dto");
const submit_results_dto_1 = require("./dto/submit-results.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let ExamsController = class ExamsController {
    constructor(examsService) {
        this.examsService = examsService;
    }
    create(dto, tenantId, userId) {
        return this.examsService.create(dto, tenantId, userId);
    }
    findAll(tenantId, groupId, page = 1, limit = 20) {
        return this.examsService.findAll(tenantId, groupId, +page, +limit);
    }
    findOne(id, tenantId) {
        return this.examsService.findOne(id, tenantId);
    }
    submitResults(id, dto, tenantId) {
        return this.examsService.submitResults(id, dto, tenantId);
    }
    getGroupStats(groupId, tenantId) {
        return this.examsService.getGroupExamStats(groupId, tenantId);
    }
};
exports.ExamsController = ExamsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('exam.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi imtihon yaratish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __param(2, (0, index_2.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exam_dto_1.CreateExamDto, String, String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('exam.read'),
    (0, swagger_1.ApiOperation)({ summary: "Imtihonlar ro'yxati" }),
    __param(0, (0, index_2.TenantId)()),
    __param(1, (0, common_1.Query)('groupId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, index_2.Permissions)('exam.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Imtihon natijalari va statistikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/results'),
    (0, index_2.Permissions)('exam.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Imtihon natijalarini kiritish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, submit_results_dto_1.SubmitExamResultsDto, String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "submitResults", null);
__decorate([
    (0, common_1.Get)('group/:groupId/stats'),
    (0, index_2.Permissions)('exam.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruh imtihon statistikasi' }),
    __param(0, (0, common_1.Param)('groupId', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExamsController.prototype, "getGroupStats", null);
exports.ExamsController = ExamsController = __decorate([
    (0, swagger_1.ApiTags)('Exams'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('exams'),
    __metadata("design:paramtypes", [exams_service_1.ExamsService])
], ExamsController);
//# sourceMappingURL=exams.controller.js.map