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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const filter_course_dto_1 = require("./dto/filter-course.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    create(dto, tenantId) {
        return this.coursesService.create(dto, tenantId);
    }
    findAll(filters, tenantId) {
        return this.coursesService.findAll(filters, tenantId);
    }
    findOne(id, tenantId) {
        return this.coursesService.findOne(id, tenantId);
    }
    update(id, dto, tenantId) {
        return this.coursesService.update(id, dto, tenantId);
    }
    remove(id, tenantId) {
        return this.coursesService.remove(id, tenantId);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('course.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi kurs yaratish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('course.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha kurslar' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_course_dto_1.FilterCourseDto, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, index_2.Permissions)('course.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Kurs batafsil' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_2.Permissions)('course.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Kursni yangilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, index_2.Permissions)('course.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Kursni o\'chirish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "remove", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Courses'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('courses'),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map