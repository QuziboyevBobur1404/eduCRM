import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
interface LogActivityDto {
    userId: string;
    tenantId: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: {
        before?: any;
        after?: any;
    };
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(dto: LogActivityDto): Promise<{
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
    }>;
    findAll(tenantId: string, page?: number, limit?: number, filters?: {
        userId?: string;
        entityType?: string;
        action?: string;
        from?: string;
        to?: string;
    }): Promise<PaginatedResult<{
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
    onStudentUpdated(payload: any): Promise<void>;
    onPaymentReceived(payload: any): Promise<void>;
}
export {};
