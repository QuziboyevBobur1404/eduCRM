import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(userId: string, page?: number, limit?: number, onlyUnread?: string): Promise<{
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
    getUnreadCount(userId: string): Promise<number>;
    markRead(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
