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
exports.CreateTeacherDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTeacherDto {
}
exports.CreateTeacherDto = CreateTeacherDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Akbar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rahimov' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'akbar@educrm.uz' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Teacher@12345' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+998901234567' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\+998[0-9]{9}$/, { message: "Telefon +998XXXXXXXXX formatida bo'lishi kerak" }),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'IELTS, Speaking' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "speciality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateTeacherDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3000000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTeacherDto.prototype, "salary", void 0);
//# sourceMappingURL=create-teacher.dto.js.map