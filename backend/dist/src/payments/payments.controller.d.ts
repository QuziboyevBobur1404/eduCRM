import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto, tenantId: string, userId: string): Promise<{
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
    }>;
    findAll(filters: FilterPaymentDto, tenantId: string): Promise<import("../common/dto/pagination.dto").PaginatedResult<{
        student: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string;
        };
    } & {
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
    }>>;
    getOverdue(tenantId: string): Promise<({
        student: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string;
            parentPhone: string;
        };
    } & {
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
    })[]>;
    getAnalytics(tenantId: string, year?: number): Promise<{
        monthlyRevenue: {
            month: number;
            total: number;
            count: number;
        }[];
        statusSummary: {
            [k: string]: {
                total: number;
                count: number;
            };
        };
        thisMonth: {
            total: number;
            count: number;
        };
    }>;
}
