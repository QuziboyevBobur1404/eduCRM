import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class AnalyticsService {
    private prisma;
    private redis;
    constructor(prisma: PrismaService, redis: RedisService);
    getDashboardStats(tenantId: string): Promise<unknown>;
    getGrowthChart(tenantId: string, year: number): Promise<unknown>;
    getTopTeachers(tenantId: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        groups: number;
        students: number;
    }[]>;
    private getMonthlyAttendanceRate;
    invalidateDashboardCache(): Promise<void>;
}
