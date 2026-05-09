import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { GatewayModule } from './gateway/gateway.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { CoursesModule } from './courses/courses.module';
import { GroupsModule } from './groups/groups.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';
import { ExamsModule } from './exams/exams.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { FilesModule } from './files/files.module';
import { AuditModule } from './audit/audit.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    // ── Core ─────────────────────────────────────────────────
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 900000, limit: 100 }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true }),

    // ── Infrastructure ───────────────────────────────────────
    PrismaModule,
    RedisModule,
    GatewayModule,

    // ── Feature modules ──────────────────────────────────────
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    CoursesModule,
    GroupsModule,
    AttendanceModule,
    PaymentsModule,
    ExamsModule,
    NotificationsModule,
    AnalyticsModule,
    FilesModule,
    AuditModule,
    SettingsModule,
  ],
})
export class AppModule {}
