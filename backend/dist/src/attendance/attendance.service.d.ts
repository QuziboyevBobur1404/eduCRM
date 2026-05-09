import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { BulkAttendanceDto, FilterAttendanceDto } from './dto/index';
import { PaginatedResult } from '../common/dto/pagination.dto';
export declare class AttendanceService {
    private prisma;
    private events;
    constructor(prisma: PrismaService, events: EventEmitter2);
    bulkCreate(dto: BulkAttendanceDto, takenById: string, tenantId: string): Promise<{
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
    findAll(filters: FilterAttendanceDto, tenantId: string): Promise<PaginatedResult<{
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
    private checkAbsenceLimit;
}
