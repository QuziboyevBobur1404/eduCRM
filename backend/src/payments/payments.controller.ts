import {
  Body, Controller, Get, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';
import { JwtAuthGuard } from '../common/guards/index';
import { CurrentUser, Permissions, TenantId } from '../common/decorators/index';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @Permissions('payment.create')
  @ApiOperation({ summary: "To'lov qabul qilish" })
  create(
    @Body() dto: CreatePaymentDto,
    @TenantId() tenantId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.paymentsService.create(dto, tenantId, userId);
  }

  @Get()
  @Permissions('payment.read')
  @ApiOperation({ summary: "To'lovlar ro'yxati" })
  findAll(@Query() filters: FilterPaymentDto, @TenantId() tenantId: string) {
    return this.paymentsService.findAll(filters, tenantId);
  }

  @Get('overdue')
  @Permissions('payment.read')
  @ApiOperation({ summary: "Muddati o'tgan to'lovlar (qarzdorlar)" })
  getOverdue(@TenantId() tenantId: string) {
    return this.paymentsService.getOverdue(tenantId);
  }

  @Get('analytics')
  @Permissions('payment.read')
  @ApiOperation({ summary: "To'lov analitikasi" })
  getAnalytics(
    @TenantId() tenantId: string,
    @Query('year') year?: number,
  ) {
    return this.paymentsService.getAnalytics(tenantId, year || new Date().getFullYear());
  }
}
