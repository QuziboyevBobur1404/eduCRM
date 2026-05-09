import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from '../gateway/app.gateway';
import { NotificationType, NotificationChannel } from '../common/enums/index';
interface CreateNotificationDto {
    userId: string;
    type: NotificationType;
    channel?: NotificationChannel;
    title: string;
    body: string;
    data?: any;
}
export declare class NotificationsService {
    private prisma;
    private gateway;
    private config;
    private readonly logger;
    constructor(prisma: PrismaService, gateway: AppGateway, config: ConfigService);
    create(dto: CreateNotificationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: import(".prisma/client").$Enums.NotificationType;
        channel: import(".prisma/client").$Enums.NotificationChannel;
        body: string;
        isRead: boolean;
        readAt: Date | null;
    }>;
    notifyAdmins(tenantId: string, type: NotificationType, title: string, body: string, data?: any): Promise<void>;
    findAll(userId: string, page?: number, limit?: number, onlyUnread?: boolean): Promise<{
        unreadCount: number;
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
            type: import(".prisma/client").$Enums.NotificationType;
            channel: import(".prisma/client").$Enums.NotificationChannel;
            body: string;
            isRead: boolean;
            readAt: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    markRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadCount(userId: string): Promise<number>;
    sendEmail(to: string, subject: string, html: string): Promise<void>;
    onStudentCreated(payload: {
        student: any;
        tenantId: string;
    }): Promise<void>;
    onStudentInactivated(payload: {
        studentId: string;
    }): Promise<void>;
    onAbsenceLimit(payload: {
        studentId: string;
        absenceCount: number;
        tenantId: string;
    }): Promise<void>;
    onPaymentOverdue(payload: {
        count: number;
    }): void;
    onPaymentReminders(payload: {
        payments: any[];
    }): Promise<void>;
}
export {};
