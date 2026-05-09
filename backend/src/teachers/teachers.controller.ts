import {
  Body, Controller, Delete, Get, Param,
  ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Teachers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Post()
  @Permissions('teacher.create')
  @ApiOperation({ summary: 'Yangi o\'qituvchi qo\'shish' })
  create(
    @Body() dto: CreateTeacherDto,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.create(dto, tenantId);
  }

  @Get()
  @Permissions('teacher.read')
  @ApiOperation({ summary: 'O\'qituvchilar ro\'yxati' })
  findAll(
    @Query() filters: FilterTeacherDto,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.findAll(filters, tenantId);
  }

  @Get(':id')
  @Permissions('teacher.read')
  @ApiOperation({ summary: 'O\'qituvchi batafsil' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Permissions('teacher.update')
  @ApiOperation({ summary: 'O\'qituvchini yangilash' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @Permissions('teacher.delete')
  @ApiOperation({ summary: 'O\'qituvchini o\'chirish' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.remove(id, tenantId);
  }

  @Get(':id/stats')
  @Permissions('teacher.read')
  @ApiOperation({ summary: 'O\'qituvchi statistikasi' })
  getStats(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.teachersService.getStats(id, tenantId);
  }
}
