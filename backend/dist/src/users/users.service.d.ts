import { Role } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, page?: number, limit?: number, role?: Role): Promise<PaginatedResult<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        lastLoginAt: Date;
        teacher: {
            id: string;
            speciality: string;
        };
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        lastLoginAt: Date;
        teacher: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            deletedAt: Date | null;
            userId: string;
            speciality: string | null;
            bio: string | null;
            salary: import("@prisma/client/runtime/library").Decimal | null;
            joinedDate: Date;
        };
    }>;
    updateProfile(id: string, tenantId: string, data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    toggleActive(id: string, tenantId: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
