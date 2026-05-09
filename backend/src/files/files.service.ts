import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async saveFile(
    file: Express.Multer.File,
    uploadedById: string,
    tenantId: string,
    entityId?: string,
    entityType?: string,
  ) {
    const baseUrl = this.config.get('BASE_URL', 'http://localhost:3001');
    const url = `${baseUrl}/uploads/${file.filename}`;

    const saved = await this.prisma.file.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        url,
        uploadedById,
        tenantId,
      },
    });

    if (entityId && entityType === 'student') {
      await this.prisma.student.update({ where: { id: entityId }, data: { avatar: url } });
    } else if (entityId && entityType === 'user') {
      await this.prisma.user.update({ where: { id: entityId }, data: { avatar: url } });
    }

    return { url, fileId: saved.id };
  }

  async deleteFile(id: string, tenantId: string) {
    const file = await this.prisma.file.findFirst({ where: { id, tenantId } });
    if (!file) throw new NotFoundException('Fayl topilmadi');

    try { fs.unlinkSync(file.path); } catch {}

    await this.prisma.file.delete({ where: { id } });
    return { message: "Fayl o'chirildi" };
  }
}
