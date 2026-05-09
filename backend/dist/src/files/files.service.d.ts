import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class FilesService {
    private prisma;
    private config;
    constructor(prisma: PrismaService, config: ConfigService);
    saveFile(file: Express.Multer.File, uploadedById: string, tenantId: string, entityId?: string, entityType?: string): Promise<{
        url: string;
        fileId: string;
    }>;
    deleteFile(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
