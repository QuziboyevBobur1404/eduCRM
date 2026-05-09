import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    get(tenantId: string, key: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    getAll(tenantId: string): Promise<{
        [k: string]: import("@prisma/client/runtime/library").JsonValue;
    }>;
    set(tenantId: string, key: string, value: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    setMany(tenantId: string, data: Record<string, any>): Promise<{
        updated: number;
    }>;
    delete(tenantId: string, key: string): Promise<{
        message: string;
    }>;
}
