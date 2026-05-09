import { AttendanceService } from './attendance.service';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    bulkCreate(dto: BulkAttendanceDto, userId: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        groupId: string;
        studentId: string;
        date: Date;
        lessonNum: number;
        takenById: string;
    }[]>;
    findAll(filters: FilterAttendanceDto, tenantId: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        group: {
            id: string;
            name: string;
        };
        student: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        groupId: string;
        studentId: string;
        date: Date;
        lessonNum: number;
        takenById: string;
    }>>;
    getGroupAttendance(groupId: string, date: string, tenantId: string): Promise<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string;
        };
        attendance: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AttendanceStatus;
            notes: string | null;
            groupId: string;
            studentId: string;
            date: Date;
            lessonNum: number;
            takenById: string;
        };
    }[]>;
    getAnalytics(tenantId: string, from?: string, to?: string): Promise<{
        total: number;
        attendanceRate: string;
        byStatus: {
            [k: string]: number;
        };
        mostAbsentStudents: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            absenceCount: number;
        }[];
    }>;
}
