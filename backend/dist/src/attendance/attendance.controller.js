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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const bulk_attendance_dto_1 = require("./dto/bulk-attendance.dto");
const filter_attendance_dto_1 = require("./dto/filter-attendance.dto");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    bulkCreate(dto, userId, tenantId) {
        return this.attendanceService.bulkCreate(dto, userId, tenantId);
    }
    findAll(filters, tenantId) {
        return this.attendanceService.findAll(filters, tenantId);
    }
    getGroupAttendance(groupId, date, tenantId) {
        return this.attendanceService.getGroupAttendance(groupId, date, tenantId);
    }
    getAnalytics(tenantId, from, to) {
        return this.attendanceService.getAnalytics(tenantId, from, to);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('bulk'),
    (0, index_2.Permissions)('attendance.create'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruh davomatini belgilash' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, index_2.CurrentUser)('id')),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_attendance_dto_1.BulkAttendanceDto, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)(),
    (0, index_2.Permissions)('attendance.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Davomat ro\'yxati' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_attendance_dto_1.FilterAttendanceDto, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('group/:groupId'),
    (0, index_2.Permissions)('attendance.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Guruhning ma\'lum kundagi davomati' }),
    __param(0, (0, common_1.Param)('groupId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getGroupAttendance", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, index_2.Permissions)('attendance.read'),
    (0, swagger_1.ApiOperation)({ summary: 'Davomat analitikasi' }),
    __param(0, (0, index_2.TenantId)()),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getAnalytics", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('Attendance'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map