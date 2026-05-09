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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teachers_service_1 = require("./teachers.service");
const create_teacher_dto_1 = require("./dto/create-teacher.dto");
const update_teacher_dto_1 = require("./dto/update-teacher.dto");
const filter_teacher_dto_1 = require("./dto/filter-teacher.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let TeachersController = class TeachersController {
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    create(dto, tenantId) {
        return this.teachersService.create(dto, tenantId);
    }
    findAll(filters, tenantId) {
        return this.teachersService.findAll(filters, tenantId);
    }
    findOne(id, tenantId) {
        return this.teachersService.findOne(id, tenantId);
    }
    update(id, dto, tenantId) {
        return this.teachersService.update(id, dto, tenantId);
    }
    remove(id, tenantId) {
        return this.teachersService.remove(id, tenantId);
    }
    getStats(id, tenantId) {
        return this.teachersService.getStats(id, tenantId);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('teacher.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi o\'qituvchi qo\'shish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_teacher_dto_1.CreateTeacherDto, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('teacher.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'qituvchilar ro\'yxati' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_teacher_dto_1.FilterTeacherDto, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, index_2.Permissions)('teacher.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'qituvchi batafsil' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_2.Permissions)('teacher.update'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'qituvchini yangilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_teacher_dto_1.UpdateTeacherDto, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, index_2.Permissions)('teacher.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'qituvchini o\'chirish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, index_2.Permissions)('teacher.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'qituvchi statistikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeachersController.prototype, "getStats", null);
exports.TeachersController = TeachersController = __decorate([
    (0, swagger_1.ApiTags)('Teachers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('teachers'),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map