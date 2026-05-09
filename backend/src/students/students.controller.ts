import {
  Body, Controller, Delete, Get, Param,
  ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Students')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Post()
  @Permissions('student.create')
  @ApiOperation({ summary: 'Yangi o\'quvchi qo\'shish' })
  create(
    @Body() dto: CreateStudentDto,
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.studentsService.create(dto, tenantId, userId);
  }

  @Get()
  @Permissions('student.read')
  @ApiOperation({ summary: 'Barcha o\'quvchilar (filter + sahifalash)' })
  findAll(
    @Query() filters: FilterStudentDto,
    @TenantId() tenantId: string,
  ) {
    return this.studentsService.findAll(filters, tenantId);
  }

  @Get(':id')
  @Permissions('student.read')
  @ApiOperation({ summary: 'O\'quvchi batafsil' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.studentsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Permissions('student.update')
  @ApiOperation({ summary: 'O\'quvchi ma\'lumotlarini yangilash' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.studentsService.update(id, dto, tenantId, userId);
  }

  @Delete(':id')
  @Permissions('student.delete')
  @ApiOperation({ summary: 'O\'quvchini o\'chirish (soft delete)' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.studentsService.remove(id, tenantId);
  }

  @Get(':id/attendance')
  @Permissions('student.read')
  @ApiOperation({ summary: 'O\'quvchi davomat tarixi' })
  getAttendance(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
    @Query() query: any,
  ) {
    return this.studentsService.getAttendanceHistory(id, tenantId, query);
  }

  @Get(':id/payments')
  @Permissions('student.read')
  @ApiOperation({ summary: 'O\'quvchi to\'lov tarixi' })
  getPayments(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.studentsService.getPaymentHistory(id, tenantId);
  }

  @Get(':id/exams')
  @Permissions('student.read')
  @ApiOperation({ summary: 'O\'quvchi imtihon natijalari' })
  getExams(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.studentsService.getExamHistory(id, tenantId);
  }
}
