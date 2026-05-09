import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamResultsDto } from './dto/submit-results.dto';
export declare class ExamsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateExamDto, tenantId: string, createdById: string): Promise<{
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
    }>;
    findAll(tenantId: string, groupId?: string, page?: number, limit?: number): Promise<PaginatedResult<{
        group: {
            id: string;
            name: string;
        };
        _count: {
            results: number;
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
    }>>;
    findOne(id: string, tenantId: string): Promise<{
        results: {
            rank: number;
            percentage: string;
            student: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            studentId: string;
            examId: string;
            score: import("@prisma/client/runtime/library").Decimal;
        }[];
        stats: {
            avg: string;
            max: number;
            min: number;
            count: number;
            passRate: string;
        };
        group: {
            id: string;
            name: string;
        };
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
    }>;
    submitResults(examId: string, dto: SubmitExamResultsDto, tenantId: string): Promise<{
        message: string;
        results: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            studentId: string;
            examId: string;
            score: import("@prisma/client/runtime/library").Decimal;
            rank: number | null;
        }[];
    }>;
    getGroupExamStats(groupId: string, tenantId: string): Promise<{
        id: string;
        title: string;
        date: Date;
        maxScore: import("@prisma/client/runtime/library").Decimal;
        avg: string;
        count: number;
    }[]>;
}
