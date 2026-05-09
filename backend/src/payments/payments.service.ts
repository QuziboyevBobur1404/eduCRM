import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatus } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FilterPaymentDto } from './dto/filter-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(dto: CreatePaymentDto, tenantId: string, createdById: string) {
    const dueDate = new Date(dto.year, dto.month - 1, 10);

    const existing = await this.prisma.payment.findFirst({
      where: {
        studentId: dto.studentId,
        groupId: dto.groupId,
        month: dto.month,
        year: dto.year,
        tenantId,
      },
    });

    const payment = existing
      ? await this.prisma.payment.update({
          where: { id: existing.id },
          data: {
            amount: dto.amount,
            method: dto.method,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
            notes: dto.notes,
          },
        })
      : await this.prisma.payment.create({
          data: {
            studentId: dto.studentId,
            groupId: dto.groupId,
            amount: dto.amount,
            method: dto.method,
            status: PaymentStatus.PAID,
            month: dto.month,
            year: dto.year,
            dueDate,
            paidAt: new Date(),
            notes: dto.notes,
            tenantId,
            createdById,
          },
        });

    this.events.emit('payment.received', { payment, tenantId });
    return payment;
  }

  async findAll(filters: FilterPaymentDto, tenantId: string) {
    const { page = 1, limit = 20, status, studentId, month, year, groupId } = filters;
    const where: any = {
      tenantId,
      ...(status && { status }),
      ...(studentId && { studentId }),
      ...(month && { month: Number(month) }),
      ...(year && { year: Number(year) }),
      ...(groupId && { groupId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          student: {
            select: {
              id: true, firstName: true, lastName: true,
              phone: true, avatar: true,
            },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async getOverdue(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId, status: PaymentStatus.OVERDUE },
      include: {
        student: {
          select: {
            id: true, firstName: true, lastName: true,
            phone: true, parentPhone: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async getAnalytics(tenantId: string, year: number) {
    const monthlyRevenue = await this.prisma.payment.groupBy({
      by: ['month'],
      where: { tenantId, status: PaymentStatus.PAID, year },
      _sum: { amount: true },
      _count: true,
      orderBy: { month: 'asc' },
    });

    const statusSummary = await this.prisma.payment.groupBy({
      by: ['status'],
      where: { tenantId, year },
      _sum: { amount: true },
      _count: true,
    });

    const now = new Date();
    const thisMonth = await this.prisma.payment.aggregate({
      where: {
        tenantId,
        status: PaymentStatus.PAID,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
      _sum: { amount: true },
      _count: true,
    });

    return {
      monthlyRevenue: monthlyRevenue.map((m) => ({
        month: m.month,
        total: Number(m._sum.amount || 0),
        count: m._count,
      })),
      statusSummary: Object.fromEntries(
        statusSummary.map((s) => [
          s.status,
          { total: Number(s._sum.amount || 0), count: s._count },
        ]),
      ),
      thisMonth: {
        total: Number(thisMonth._sum.amount || 0),
        count: thisMonth._count,
      },
    };
  }

  @Cron('0 0 * * *', { name: 'check-overdue-payments' })
  async checkOverduePayments() {
    const result = await this.prisma.payment.updateMany({
      where: { status: PaymentStatus.PENDING, dueDate: { lt: new Date() } },
      data: { status: PaymentStatus.OVERDUE },
    });
    if (result.count > 0) {
      this.events.emit('payment.bulk_overdue', { count: result.count });
    }
    return result.count;
  }

  @Cron('0 8 1 * *', { name: 'auto-create-monthly-payments' })
  async autoCreateMonthlyPayments() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dueDate = new Date(year, month - 1, 10);

    const activeGroupStudents = await this.prisma.groupStudent.findMany({
      where: { isActive: true },
      include: {
        group: { include: { course: { select: { monthlyPrice: true } } } },
      },
    });

    let created = 0;
    for (const gs of activeGroupStudents) {
      const exists = await this.prisma.payment.findFirst({
        where: { studentId: gs.studentId, groupId: gs.groupId, month, year },
      });
      if (!exists) {
        await this.prisma.payment.create({
          data: {
            studentId: gs.studentId,
            groupId: gs.groupId,
            amount: gs.group.course.monthlyPrice,
            status: PaymentStatus.PENDING,
            month,
            year,
            dueDate,
            tenantId: gs.group.tenantId,
          },
        });
        created++;
      }
    }

    this.events.emit('payment.monthly_created', { count: created, month, year });
    return created;
  }

  @Cron('0 9 7 * *', { name: 'payment-reminders' })
  async sendPaymentReminders() {
    const now = new Date();
    const pending = await this.prisma.payment.findMany({
      where: {
        status: PaymentStatus.PENDING,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
    });
    this.events.emit('payment.reminders_due', { payments: pending });
    return pending.length;
  }
}
