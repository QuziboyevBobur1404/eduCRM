import {
  Body, Controller, Delete, Get, Param,
  ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FilterCourseDto } from './dto/filter-course.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Post()
  @Permissions('course.create')
  @ApiOperation({ summary: 'Yangi kurs yaratish' })
  create(@Body() dto: CreateCourseDto, @TenantId() tenantId: string) {
    return this.coursesService.create(dto, tenantId);
  }

  @Get()
  @Permissions('course.read')
  @ApiOperation({ summary: 'Barcha kurslar' })
  findAll(@Query() filters: FilterCourseDto, @TenantId() tenantId: string) {
    return this.coursesService.findAll(filters, tenantId);
  }

  @Get(':id')
  @Permissions('course.read')
  @ApiOperation({ summary: 'Kurs batafsil' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.coursesService.findOne(id, tenantId);
  }

  @Patch(':id')
  @Permissions('course.update')
  @ApiOperation({ summary: 'Kursni yangilash' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
    @TenantId() tenantId: string,
  ) {
    return this.coursesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @Permissions('course.delete')
  @ApiOperation({ summary: 'Kursni o\'chirish' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.coursesService.remove(id, tenantId);
  }
}
