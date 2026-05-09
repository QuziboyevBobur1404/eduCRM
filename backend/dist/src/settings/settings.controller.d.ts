import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getAll(tenantId: string): Promise<{
        [k: string]: import("@prisma/client/runtime/library").JsonValue;
    }>;
    get(key: string, tenantId: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    set(key: string, body: {
        value: any;
    }, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
    setMany(data: Record<string, any>, tenantId: string): Promise<{
        updated: number;
    }>;
    delete(key: string, tenantId: string): Promise<{
        message: string;
    }>;
}
