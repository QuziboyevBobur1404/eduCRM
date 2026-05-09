import {
  Body, Controller, Delete, Get, Param,
  Post, Put, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/index';
import { Roles, TenantId } from '../common/decorators/index';
import { Role } from '../common/enums/index';

@ApiTags('Settings')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha sozlamalar' })
  getAll(@TenantId() tenantId: string) {
    return this.settingsService.getAll(tenantId);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Bitta sozlama' })
  get(@Param('key') key: string, @TenantId() tenantId: string) {
    return this.settingsService.get(tenantId, key);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Sozlamani yangilash yoki yaratish' })
  set(
    @Param('key') key: string,
    @Body() body: { value: any },
    @TenantId() tenantId: string,
  ) {
    return this.settingsService.set(tenantId, key, body.value);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Ko\'p sozlamani bir vaqtda yangilash' })
  setMany(@Body() data: Record<string, any>, @TenantId() tenantId: string) {
    return this.settingsService.setMany(tenantId, data);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Sozlamani o\'chirish' })
  delete(@Param('key') key: string, @TenantId() tenantId: string) {
    return this.settingsService.delete(tenantId, key);
  }
}
