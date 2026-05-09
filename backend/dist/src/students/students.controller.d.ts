import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
export declare class StudentsController {
    private studentsService;
    constructor(studentsService: StudentsService);
    create(dto: CreateStudentDto, tenantId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string | null;
        tenantId: string;
        deletedAt: Date | null;
        joinedDate: Date;
        parentPhone: string | null;
        address: string | null;
        birthDate: Date | null;
        gender: import(".prisma/client").$Enums.Gender;
        status: import(".prisma/client").$Enums.StudentStatus;
        notes: string | null;
        createdById: string | null;
    }>;
    findAll(filters: FilterStudentDto, tenantId: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        createdAt: Date;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        joinedDate: Date;
        parentPhone: string;
        gender: import(".prisma/client").$Enums.Gender;
        status: import(".prisma/client").$Enums.StudentStatus;
        groupStudents: {
            group: {
                id: string;
                name: string;
                course: {
                    name: string;
                };
            };
        }[];
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        groupStudents: ({
            group: {
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
            };
        } & {
            id: string;
            isActive: boolean;
            groupId: string;
            studentId: string;
            joinedAt: Date;
            leftAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string | null;
        tenantId: string;
        deletedAt: Date | null;
        joinedDate: Date;
        parentPhone: string | null;
        address: string | null;
        birthDate: Date | null;
        gender: import(".prisma/client").$Enums.Gender;
        status: import(".prisma/client").$Enums.StudentStatus;
        notes: string | null;
        createdById: string | null;
    }>;
    update(id: string, dto: UpdateStudentDto, tenantId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string | null;
        tenantId: string;
        deletedAt: Date | null;
        joinedDate: Date;
        parentPhone: string | null;
        address: string | null;
        birthDate: Date | null;
        gender: import(".prisma/client").$Enums.Gender;
        status: import(".prisma/client").$Enums.StudentStatus;
        notes: string | null;
        createdById: string | null;
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    getAttendance(id: string, tenantId: string, query: any): Promise<{
        data: ({
            group: {
                id: string;
                name: string;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        stats: {
            [k: string]: number;
        };
    }>;
    getPayments(id: string, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        notes: string | null;
        createdById: string | null;
        groupId: string;
        studentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        currency: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        month: number;
        year: number;
        dueDate: Date;
        paidAt: Date | null;
        receiptUrl: string | null;
    }[]>;
    getExams(id: string, tenantId: string): Promise<({
        exam: {
            group: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
            createdById: string | null;
            groupId: string;
            date: Date;
            title: string;
            maxScore: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        studentId: string;
        examId: string;
        score: import("@prisma/client/runtime/library").Decimal;
        rank: number | null;
    })[]>;
}
