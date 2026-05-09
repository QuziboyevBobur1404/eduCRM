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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const filter_student_dto_1 = require("./dto/filter-student.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    create(dto, tenantId, userId) {
        return this.studentsService.create(dto, tenantId, userId);
    }
    findAll(filters, tenantId) {
        return this.studentsService.findAll(filters, tenantId);
    }
    findOne(id, tenantId) {
        return this.studentsService.findOne(id, tenantId);
    }
    update(id, dto, tenantId, userId) {
        return this.studentsService.update(id, dto, tenantId, userId);
    }
    remove(id, tenantId) {
        return this.studentsService.remove(id, tenantId);
    }
    getAttendance(id, tenantId, query) {
        return this.studentsService.getAttendanceHistory(id, tenantId, query);
    }
    getPayments(id, tenantId) {
        return this.studentsService.getPaymentHistory(id, tenantId);
    }
    getExams(id, tenantId) {
        return this.studentsService.getExamHistory(id, tenantId);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('student.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi o\'quvchi qo\'shish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __param(2, (0, index_2.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto, String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('student.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha o\'quvchilar (filter + sahifalash)' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_student_dto_1.FilterStudentDto, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, index_2.Permissions)('student.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchi batafsil' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_2.Permissions)('student.update'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchi ma\'lumotlarini yangilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __param(3, (0, index_2.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto, String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, index_2.Permissions)('student.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchini o\'chirish (soft delete)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/attendance'),
    (0, index_2.Permissions)('student.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchi davomat tarixi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)(':id/payments'),
    (0, index_2.Permissions)('student.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchi to\'lov tarixi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)(':id/exams'),
    (0, index_2.Permissions)('student.read'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'quvchi imtihon natijalari' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getExams", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Students'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map