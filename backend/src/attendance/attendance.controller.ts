import {
  Body, Controller, Get, Param,
  ParseUUIDPipe, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { BulkAttendanceDto } from './dto/bulk-attendance.dto';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Attendance')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('bulk')
  @Permissions('attendance.create')
  @ApiOperation({ summary: 'Guruh davomatini belgilash' })
  bulkCreate(
    @Body() dto: BulkAttendanceDto,
    @CurrentUser('id') userId: string,
    @TenantId() tenantId: string,
  ) {
    return this.attendanceService.bulkCreate(dto, userId, tenantId);
  }

  @Get()
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Davomat ro\'yxati' })
  findAll(
    @Query() filters: FilterAttendanceDto,
    @TenantId() tenantId: string,
  ) {
    return this.attendanceService.findAll(filters, tenantId);
  }

  @Get('group/:groupId')
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Guruhning ma\'lum kundagi davomati' })
  getGroupAttendance(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Query('date') date: string,
    @TenantId() tenantId: string,
  ) {
    return this.attendanceService.getGroupAttendance(groupId, date, tenantId);
  }

  @Get('analytics')
  @Permissions('attendance.read')
  @ApiOperation({ summary: 'Davomat analitikasi' })
  getAnalytics(
    @TenantId() tenantId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.getAnalytics(tenantId, from, to);
  }
}
