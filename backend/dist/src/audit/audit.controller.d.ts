import { AuditService } from './audit.service';
export declare class AuditController {
    private auditService;
    constructor(auditService: AuditService);
    findAll(tenantId: string, page?: number, limit?: number, userId?: string, entityType?: string, action?: string, from?: string, to?: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            avatar: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string;
        entityId: string;
        entityType: string;
        action: string;
        changes: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>>;
    getEntityHistory(entityType: string, entityId: string, tenantId: string): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        userId: string;
        entityId: string;
        entityType: string;
        action: string;
        changes: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
}
