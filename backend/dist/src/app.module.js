"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const gateway_module_1 = require("./gateway/gateway.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const courses_module_1 = require("./courses/courses.module");
const groups_module_1 = require("./groups/groups.module");
const attendance_module_1 = require("./attendance/attendance.module");
const payments_module_1 = require("./payments/payments.module");
const exams_module_1 = require("./exams/exams.module");
const notifications_module_1 = require("./notifications/notifications.module");
const analytics_module_1 = require("./analytics/analytics.module");
const files_module_1 = require("./files/files.module");
const audit_module_1 = require("./audit/audit.module");
const settings_module_1 = require("./settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 900000, limit: 100 }]),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot({ wildcard: true }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            gateway_module_1.GatewayModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            courses_module_1.CoursesModule,
            groups_module_1.GroupsModule,
            attendance_module_1.AttendanceModule,
            payments_module_1.PaymentsModule,
            exams_module_1.ExamsModule,
            notifications_module_1.NotificationsModule,
            analytics_module_1.AnalyticsModule,
            files_module_1.FilesModule,
            audit_module_1.AuditModule,
            settings_module_1.SettingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map