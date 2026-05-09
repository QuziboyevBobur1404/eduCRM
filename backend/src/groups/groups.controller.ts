import {
  Body, Controller, Delete, Get, Param,
  ParseUUIDPipe, Patch, Post, Put, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddStudentsDto } from './dto/add-students.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { FilterGroupDto } from './dto/filter-group.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Groups')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  @Permissions('group.create')
  @ApiOperation({ summary: 'Yangi guruh yaratish' })
  create(@Body() dto: CreateGroupDto, @TenantId() tenantId: string) {
    return this.groupsService.create(dto, tenantId);
  }

  @Get()
  @Permissions('group.read')
  @ApiOperation({ summary: 'Guruhlar ro\'yxati' })
  findAll(@Query() filters: FilterGroupDto, @TenantId() tenantId: string) {
    return this.groupsService.findAll(filters, tenantId);
  }

  @Get(':id')
  @Permissions('group.read')
  @ApiOperation({ summary: 'Guruh batafsil (o\'quvchilar, jadval)' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Permissions('group.update')
  @ApiOperation({ summary: 'Guruhni yangilash' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDto,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.update(id, dto, tenantId);
  }

  @Post(':id/students')
  @Permissions('group.update')
  @ApiOperation({ summary: 'Guruhga o\'quvchi qo\'shish' })
  addStudents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddStudentsDto,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.addStudents(id, dto, tenantId);
  }

  @Delete(':id/students/:studentId')
  @Permissions('group.update')
  @ApiOperation({ summary: 'Guruhdan o\'quvchini chiqarish' })
  removeStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.removeStudent(id, studentId, tenantId);
  }

  @Put(':id/schedules')
  @Permissions('group.update')
  @ApiOperation({ summary: 'Guruh dars jadvalini belgilash' })
  setSchedules(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() schedules: CreateScheduleDto[],
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.setSchedules(id, schedules, tenantId);
  }

  @Get(':id/stats')
  @Permissions('group.read')
  @ApiOperation({ summary: 'Guruh statistikasi' })
  getStats(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.getStats(id, tenantId);
  }

  @Delete(':id')
  @Permissions('group.delete')
  @ApiOperation({ summary: 'Guruhni o\'chirish' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.groupsService.remove(id, tenantId);
  }
}
