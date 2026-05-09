import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
export declare class TeachersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTeacherDto, tenantId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
        };
    } & {
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
    }>;
    findAll(filters: FilterTeacherDto, tenantId: string): Promise<PaginatedResult<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
        };
        _count: {
            groups: number;
        };
    } & {
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
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        groups: ({
            course: {
                name: string;
            };
            schedules: {
                id: string;
                createdAt: Date;
                groupId: string;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
            }[];
            _count: {
                students: number;
            };
        } & {
            id: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            deletedAt: Date | null;
            courseId: string;
            teacherId: string;
            capacity: number;
            roomNumber: string | null;
            startDate: Date | null;
            endDate: Date | null;
        })[];
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
            lastLoginAt: Date;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdateTeacherDto, tenantId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
        };
    } & {
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
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    getStats(id: string, tenantId: string): Promise<{
        activeGroups: number;
        totalStudents: number;
        attendanceRate: string;
    }>;
}
