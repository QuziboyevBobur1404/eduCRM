import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddStudentsDto } from './dto/add-students.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { FilterGroupDto } from './dto/filter-group.dto';
export declare class GroupsController {
    private groupsService;
    constructor(groupsService: GroupsService);
    create(dto: CreateGroupDto, tenantId: string): Promise<{
        teacher: {
            user: {
                firstName: string;
                lastName: string;
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
        };
        course: {
            id: string;
            name: string;
            monthlyPrice: import("@prisma/client/runtime/library").Decimal;
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
    }>;
    findAll(filters: FilterGroupDto, tenantId: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        teacher: {
            user: {
                firstName: string;
                lastName: string;
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
        };
        course: {
            id: string;
            name: string;
            monthlyPrice: import("@prisma/client/runtime/library").Decimal;
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
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        students: ({
            student: {
                id: string;
                firstName: string;
                lastName: string;
                phone: string;
                avatar: string;
                status: import(".prisma/client").$Enums.StudentStatus;
            };
        } & {
            id: string;
            isActive: boolean;
            groupId: string;
            studentId: string;
            joinedAt: Date;
            leftAt: Date | null;
        })[];
        teacher: {
            user: {
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
        };
        course: {
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
            exams: number;
            attendances: number;
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
    }>;
    update(id: string, dto: UpdateGroupDto, tenantId: string): Promise<{
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
        course: {
            id: string;
            name: string;
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
    }>;
    addStudents(id: string, dto: AddStudentsDto, tenantId: string): Promise<{
        message: string;
    }>;
    removeStudent(id: string, studentId: string, tenantId: string): Promise<{
        message: string;
    }>;
    setSchedules(id: string, schedules: CreateScheduleDto[], tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        groupId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[]>;
    getStats(id: string, tenantId: string): Promise<{
        totalStudents: number;
        attendanceRate: string;
        monthlyRevenue: number;
        pendingPayments: number;
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
