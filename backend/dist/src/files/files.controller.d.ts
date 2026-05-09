import { FilesService } from './files.service';
export declare class FilesController {
    private filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, userId: string, tenantId: string, entityId?: string, entityType?: string): Promise<{
        url: string;
        fileId: string;
    }>;
    deleteFile(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
