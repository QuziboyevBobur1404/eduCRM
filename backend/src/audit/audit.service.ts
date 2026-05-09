import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';

interface LogActivityDto {
  userId: string;
  tenantId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: { before?: any; after?: any };
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(dto: LogActivityDto) {
    return this.prisma.activityLog.create({
      data: {
        userId: dto.userId,
        tenantId: dto.tenantId,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId,
        changes: dto.changes as any,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 50,
    filters?: {
      userId?: string;
      entityType?: string;
      action?: string;
      from?: string;
      to?: string;
    },
  ) {
    const where: any = {
      tenantId,
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.entityType && { entityType: filters.entityType }),
      ...(filters?.action && { action: { contains: filters.action } }),
      ...(filters?.from && filters?.to && {
        createdAt: { gte: new Date(filters.from), lte: new Date(filters.to) },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true, firstName: true, lastName: true,
              email: true, role: true, avatar: true,
            },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async getEntityHistory(entityType: string, entityId: string, tenantId: string) {
    return this.prisma.activityLog.findMany({
      where: { entityType, entityId, tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });
  }

  @OnEvent('student.updated')
  async onStudentUpdated(payload: any) {
    await this.log({
      userId: payload.userId,
      tenantId: payload.tenantId,
      action: 'student.update',
      entityType: 'Student',
      entityId: payload.after.id,
      changes: { before: payload.before, after: payload.after },
    });
  }

  @OnEvent('payment.received')
  async onPaymentReceived(payload: any) {
    await this.log({
      userId: payload.payment.createdById || 'system',
      tenantId: payload.tenantId,
      action: 'payment.create',
      entityType: 'Payment',
      entityId: payload.payment.id,
      changes: { after: payload.payment },
    });
  }
}
