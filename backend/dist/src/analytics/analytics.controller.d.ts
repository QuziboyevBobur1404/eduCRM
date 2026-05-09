import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboard(tenantId: string): Promise<unknown>;
    getGrowth(tenantId: string, year?: number): Promise<unknown>;
    getTopTeachers(tenantId: string): Promise<{
        id: string;
        name: string;
        avatar: string;
        groups: number;
        students: number;
    }[]>;
}
