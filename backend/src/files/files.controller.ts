import {
  Controller, Post, Delete, Param, ParseUUIDPipe,
  UploadedFile, UseGuards, UseInterceptors, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, TenantId } from '../common/decorators/index';

@ApiTags('Files')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          cb(null, `${uuidv4()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Fayl yuklash' })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
    @Query('entityId') entityId?: string,
    @Query('entityType') entityType?: string,
  ) {
    return this.filesService.saveFile(file, userId, tenantId, entityId, entityType);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Faylni o'chirish" })
  deleteFile(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.filesService.deleteFile(id, tenantId);
  }
}
