import {
  Body, Controller, Delete, Get, Param,
  ParseUUIDPipe, Patch, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../common/enums/index';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Permissions('user.read')
  @ApiOperation({ summary: 'Barcha foydalanuvchilar' })
  findAll(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: Role,
  ) {
    return this.usersService.findAll(tenantId, page, limit, role);
  }

  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi profili' })
  getMe(
    @CurrentUser('id') id: string,
    @TenantId() tenantId: string,
  ) {
    return this.usersService.findOne(id, tenantId);
  }

  @Get(':id')
  @Permissions('user.read')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.usersService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Profil yangilash' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { firstName?: string; lastName?: string; phone?: string },
    @TenantId() tenantId: string,
  ) {
    return this.usersService.updateProfile(id, tenantId, body);
  }

  @Patch(':id/toggle-active')
  @Permissions('user.update')
  @ApiOperation({ summary: 'Foydalanuvchini bloklash / faollashtirish' })
  toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.usersService.toggleActive(id, tenantId);
  }

  @Delete(':id')
  @Permissions('user.delete')
  @ApiOperation({ summary: 'Foydalanuvchini o\'chirish' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @TenantId() tenantId: string,
  ) {
    return this.usersService.remove(id, tenantId);
  }
}
