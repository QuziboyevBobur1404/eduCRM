import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/index';
import { Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Permissions('analytics.read')
  @ApiOperation({ summary: 'Dashboard KPI widgetlari' })
  getDashboard(@TenantId() tenantId: string) {
    return this.analyticsService.getDashboardStats(tenantId);
  }

  @Get('growth')
  @Permissions('analytics.read')
  @ApiOperation({ summary: 'Oylik o\'sish grafigi' })
  getGrowth(
    @TenantId() tenantId: string,
    @Query('year') year?: number,
  ) {
    return this.analyticsService.getGrowthChart(
      tenantId,
      year ? +year : new Date().getFullYear(),
    );
  }

  @Get('teachers')
  @Permissions('analytics.read')
  @ApiOperation({ summary: 'Eng faol o\'qituvchilar' })
  getTopTeachers(@TenantId() tenantId: string) {
    return this.analyticsService.getTopTeachers(tenantId);
  }
}
