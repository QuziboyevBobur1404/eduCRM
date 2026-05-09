import {
  Controller, Get, Param, ParseUUIDPipe,
  Patch, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser } from '../common/decorators/index';

@ApiTags('Notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mening bildirishnomalarim' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('onlyUnread') onlyUnread?: string,
  ) {
    return this.notificationsService.findAll(
      userId,
      +page,
      +limit,
      onlyUnread === 'true',
    );
  }

  @Get('unread-count')
  @ApiOperation({ summary: "O'qilmagan bildirishnomalar soni" })
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: "Bildirishnomani o'qilgan deb belgilash" })
  markRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markRead(id, userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Barchasini o\'qilgan deb belgilash' })
  markAllRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }
}
