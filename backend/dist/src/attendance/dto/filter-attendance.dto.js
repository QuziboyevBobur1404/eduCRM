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
exports.FilterAttendanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const index_1 = require("../../common/enums/index");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class FilterAttendanceDto extends pagination_dto_1.PaginationDto {
}
exports.FilterAttendanceDto = FilterAttendanceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterAttendanceDto.prototype, "groupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], FilterAttendanceDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FilterAttendanceDto.prototype, "from", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FilterAttendanceDto.prototype, "to", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.AttendanceStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.AttendanceStatus),
    __metadata("design:type", String)
], FilterAttendanceDto.prototype, "status", void 0);
//# sourceMappingURL=filter-attendance.dto.js.map