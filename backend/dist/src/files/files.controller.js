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
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
const files_service_1 = require("./files.service");
const index_1 = require("../common/guards/index");
const index_2 = require("../common/decorators/index");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    uploadFile(file, userId, tenantId, entityId, entityType) {
        return this.filesService.saveFile(file, userId, tenantId, entityId, entityType);
    }
    deleteFile(id, tenantId) {
        return this.filesService.deleteFile(id, tenantId);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (_req, file, cb) => {
                cb(null, `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Fayl yuklash' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, index_2.CurrentUser)('id')),
    __param(2, (0, index_2.TenantId)()),
    __param(3, (0, common_1.Query)('entityId')),
    __param(4, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: "Faylni o'chirish" }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, index_2.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "deleteFile", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('Files'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(index_1.JwtAuthGuard),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map