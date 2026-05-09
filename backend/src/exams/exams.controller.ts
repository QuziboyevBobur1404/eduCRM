import {
  Body, Controller, Get, Param, ParseUUIDPipe,
  Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamResultsDto } from './dto/submit-results.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Exams')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Post()
  @Permissions('exam.create')
  @ApiOperation({ summary: 'Yangi imtihon yaratish' })
  create(
    @Body() dto: CreateExamDto,
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.examsService.create(dto, tenantId, userId);
  }

  @Get()
  @Permissions('exam.read')
  @ApiOperation({ summary: "Imtihonlar ro'yxati" })
  findAll(
    @TenantId() tenantId: string,
    @Query('groupId') groupId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.examsService.findAll(tenantId, groupId, +page, +limit);
  }

  @Get(':id')
  @Permissions('exam.read')
  @ApiOperation({ summary: 'Imtihon natijalari va statistikasi' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.examsService.findOne(id, tenantId);
  }

  @Post(':id/results')
  @Permissions('exam.update')
  @ApiOperation({ summary: 'Imtihon natijalarini kiritish' })
  submitResults(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitExamResultsDto,
    @TenantId() tenantId: string,
  ) {
    return this.examsService.submitResults(id, dto, tenantId);
  }

  @Get('group/:groupId/stats')
  @Permissions('exam.read')
  @ApiOperation({ summary: 'Guruh imtihon statistikasi' })
  getGroupStats(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @TenantId() tenantId: string,
  ) {
    return this.examsService.getGroupExamStats(groupId, tenantId);
  }
}
