import { Injectable, Logger, Optional } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from '../gateway/app.gateway';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { NotificationType, NotificationChannel } from '../common/enums/index';

interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  channel?: NotificationChannel;
  title: string;
  body: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private gateway: AppGateway,
    private config: ConfigService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        channel: dto.channel || NotificationChannel.IN_APP,
        title: dto.title,
        body: dto.body,
        data: dto.data ?? {},
      },
    });

    this.gateway.sendNotificationToUser(dto.userId, notification);
    return notification;
  }

  async notifyAdmins(
    tenantId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: any,
  ) {
    const admins = await this.prisma.user.findMany({
      where: {
        tenantId,
        role: { in: ['SUPER_ADMIN', 'ADMIN'] },
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        this.create({ userId: admin.id, type, title, body, data }),
      ),
    );
  }

  async findAll(userId: string, page = 1, limit = 20, onlyUnread = false) {
    const where: any = {
      userId,
      ...(onlyUnread && { isRead: false }),
    };

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { ...new PaginatedResult(data, total, page, limit), unreadCount };
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  // ── Email sending (optional — only if SMTP configured) ───
  async sendEmail(to: string, subject: string, html: string) {
    const smtpUser = this.config.get('SMTP_USER');
    if (!smtpUser) {
      this.logger.warn('SMTP not configured — skipping email');
      return;
    }

    try {
      // Dynamic import to avoid hard dependency
      const nodemailer = await import('nodemailer').catch(() => null);
      if (!nodemailer) {
        this.logger.warn('nodemailer not installed — skipping email');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: this.config.get('SMTP_HOST', 'smtp.gmail.com'),
        port: this.config.get<number>('SMTP_PORT', 587),
        secure: false,
        auth: {
          user: smtpUser,
          pass: this.config.get('SMTP_PASS'),
        },
      });

      await transporter.sendMail({
        from: this.config.get('SMTP_FROM', 'EduCRM <no-reply@educrm.uz>'),
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to: ${to}`);
    } catch (err: any) {
      this.logger.error(`Email failed to ${to}: ${err.message}`);
    }
  }

  // ── EVENT LISTENERS ───────────────────────────────────────

  @OnEvent('student.created')
  async onStudentCreated(payload: { student: any; tenantId: string }) {
    await this.notifyAdmins(
      payload.tenantId,
      NotificationType.NEW_STUDENT,
      "Yangi o'quvchi qo'shildi",
      `${payload.student.firstName} ${payload.student.lastName} tizimga qo'shildi`,
      { studentId: payload.student.id },
    );
  }

  @OnEvent('student.auto_inactivated')
  async onStudentInactivated(payload: { studentId: string }) {
    const student = await this.prisma.student.findUnique({
      where: { id: payload.studentId },
    });
    if (!student) return;

    await this.notifyAdmins(
      student.tenantId,
      NotificationType.STUDENT_INACTIVE,
      "O'quvchi avtomatik nofaolga o'tkazildi",
      `${student.firstName} ${student.lastName} — 10+ dars o'tkazildi`,
      { studentId: student.id },
    );
  }

  @OnEvent('student.absence_limit_exceeded')
  async onAbsenceLimit(payload: { studentId: string; absenceCount: number; tenantId: string }) {
    const student = await this.prisma.student.findUnique({
      where: { id: payload.studentId },
      select: { firstName: true, lastName: true },
    });
    if (!student) return;

    await this.notifyAdmins(
      payload.tenantId,
      NotificationType.ATTENDANCE_ALERT,
      'Davomat ogohlantirishi',
      `${student.firstName} ${student.lastName} ${payload.absenceCount} ta darsni o'tkazib yubordi`,
      { studentId: payload.studentId },
    );
  }

  @OnEvent('payment.bulk_overdue')
  onPaymentOverdue(payload: { count: number }) {
    this.logger.warn(`${payload.count} ta to'lov muddati o'tdi`);
  }

  @OnEvent('payment.reminders_due')
  async onPaymentReminders(payload: { payments: any[] }) {
    for (const payment of payload.payments) {
      if (!payment.tenantId) continue;
      const admins = await this.prisma.user.findMany({
        where: {
          tenantId: payment.tenantId,
          role: { in: ['ADMIN', 'SUPER_ADMIN'] },
          isActive: true,
        },
        select: { id: true },
      });

      for (const admin of admins) {
        await this.create({
          userId: admin.id,
          type: NotificationType.PAYMENT_DUE,
          title: "To'lov muddati yaqinlashmoqda",
          body: `${payment.student?.firstName ?? ''} ${payment.student?.lastName ?? ''} — ${payment.amount} UZS`,
          data: { paymentId: payment.id, studentId: payment.studentId },
        });
      }
    }
  }
}
