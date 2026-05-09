import { Role } from '../common/enums/index';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(tenantId: string, page?: number, limit?: number, role?: Role): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
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
    getMe(id: string, tenantId: string): Promise<{
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
    update(id: string, body: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }, tenantId: string): Promise<{
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
