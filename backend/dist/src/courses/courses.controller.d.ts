import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    create(dto: CreateCourseDto, tenantId: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        duration: number;
        level: string | null;
        monthlyPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(filters: FilterCourseDto, tenantId: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        _count: {
            groups: number;
        };
    } & {
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        duration: number;
        level: string | null;
        monthlyPrice: import("@prisma/client/runtime/library").Decimal;
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        stats: {
            activeGroups: number;
            totalStudents: number;
            totalRevenue: number;
        };
        groups: ({
            teacher: {
                user: {
                    firstName: string;
                    lastName: string;
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
            };
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
        _count: {
            groups: number;
        };
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        duration: number;
        level: string | null;
        monthlyPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateCourseDto, tenantId: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        deletedAt: Date | null;
        description: string | null;
        duration: number;
        level: string | null;
        monthlyPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
