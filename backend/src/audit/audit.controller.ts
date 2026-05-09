import {
  Controller, Get, Param, ParseUUIDPipe, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/index';
import { Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Audit')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @Permissions('audit.read')
  @ApiOperation({ summary: 'Barcha audit loglari' })
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.auditService.findAll(tenantId, page, limit, {
      userId, entityType, action, from, to,
    });
  }

  @Get(':entityType/:entityId')
  @Permissions('audit.read')
  @ApiOperation({ summary: 'Entity tarixi' })
  getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @TenantId() tenantId: string,
  ) {
    return this.auditService.getEntityHistory(entityType, entityId, tenantId);
  }
}
