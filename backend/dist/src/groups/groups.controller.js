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
exports.GroupsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const groups_service_1 = require("./groups.service");
const create_group_dto_1 = require("./dto/create-group.dto");
const update_group_dto_1 = require("./dto/update-group.dto");
const add_students_dto_1 = require("./dto/add-students.dto");
const filter_group_dto_1 = require("./dto/filter-group.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let GroupsController = class GroupsController {
    constructor(groupsService) {
        this.groupsService = groupsService;
    }
    create(dto, tenantId) {
        return this.groupsService.create(dto, tenantId);
    }
    findAll(filters, tenantId) {
        return this.groupsService.findAll(filters, tenantId);
    }
    findOne(id, tenantId) {
        return this.groupsService.findOne(id, tenantId);
    }
    update(id, dto, tenantId) {
        return this.groupsService.update(id, dto, tenantId);
    }
    addStudents(id, dto, tenantId) {
        return this.groupsService.addStudents(id, dto, tenantId);
    }
    removeStudent(id, studentId, tenantId) {
        return this.groupsService.removeStudent(id, studentId, tenantId);
    }
    setSchedules(id, schedules, tenantId) {
        return this.groupsService.setSchedules(id, schedules, tenantId);
    }
    getStats(id, tenantId) {
        return this.groupsService.getStats(id, tenantId);
    }
    remove(id, tenantId) {
        return this.groupsService.remove(id, tenantId);
    }
};
exports.GroupsController = GroupsController;
__decorate([
    (0, common_1.Post)(),
    (0, index_2.Permissions)('group.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi guruh yaratish' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_group_dto_1.CreateGroupDto, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('group.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhlar ro\'yxati' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_group_dto_1.FilterGroupDto, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, index_2.Permissions)('group.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruh batafsil (o\'quvchilar, jadval)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, index_2.Permissions)('group.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhni yangilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_group_dto_1.UpdateGroupDto, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/students'),
    (0, index_2.Permissions)('group.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhga o\'quvchi qo\'shish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_students_dto_1.AddStudentsDto, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "addStudents", null);
__decorate([
    (0, common_1.Delete)(':id/students/:studentId'),
    (0, index_2.Permissions)('group.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhdan o\'quvchini chiqarish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('studentId', common_1.ParseUUIDPipe)),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "removeStudent", null);
__decorate([
    (0, common_1.Put)(':id/schedules'),
    (0, index_2.Permissions)('group.update'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruh dars jadvalini belgilash' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "setSchedules", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, index_2.Permissions)('group.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruh statistikasi' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, index_2.Permissions)('group.delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhni o\'chirish' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GroupsController.prototype, "remove", null);
exports.GroupsController = GroupsController = __decorate([
    (0, swagger_1.ApiTags)('Groups'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('groups'),
    __metadata("design:paramtypes", [groups_service_1.GroupsService])
], GroupsController);
//# sourceMappingURL=groups.controller.js.map