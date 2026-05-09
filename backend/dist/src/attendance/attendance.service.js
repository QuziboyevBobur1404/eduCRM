"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const index_1 = require("../common/enums/index");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let AttendanceService = class AttendanceService {
    constructor(prisma, events) {
        this.prisma = prisma;
        this.events = events;
    }
    async bulkCreate(dto, takenById, tenantId) {
        const { groupId, date, lessonNum, records } = dto;
        const attendanceDate = new Date(date);
        const results = await Promise.all(records.map((record) => this.prisma.attendance.upsert({
            where: {
                studentId_groupId_date: {
                    studentId: record.studentId,
                    groupId,
                    date: attendanceDate,
                },
            },
            create: {
                studentId: record.studentId,
                groupId,
                date: attendanceDate,
                status: record.status,
                lessonNum,
                takenById,
                notes: record.notes,
            },
            update: {
                status: record.status,
                notes: record.notes,
                takenById,
            },
        })));
        this.events.emit('attendance.bulk_created', {
            groupId,
            date: attendanceDate,
            records: results,
            tenantId,
        });
        await this.checkAbsenceLimit(records.filter((r) => r.status === index_1.AttendanceStatus.ABSENT).map((r) => r.studentId), tenantId);
        return results;
    }
    async findAll(filters, tenantId) {
        const { page = 1, limit = 50, groupId, studentId, from, to, status } = filters;
        const where = {
            ...(groupId && { groupId }),
            ...(studentId && { studentId }),
            ...(status && { status }),
            ...(from && to && {
                date: { gte: new Date(from), lte: new Date(to) },
            }),
            group: { tenantId },
        };
        const [data, total] = await Promise.all([
            this.prisma.attendance.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { date: 'desc' },
                include: {
                    student: {
                        select: { id: true, firstName: true, lastName: true, avatar: true },
                    },
                    group: { select: { id: true, name: true } },
                },
            }),
            this.prisma.attendance.count({ where }),
        ]);
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async getGroupAttendance(groupId, date, tenantId) {
        const groupStudents = await this.prisma.groupStudent.findMany({
            where: { groupId, isActive: true },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, avatar: true },
                },
            },
        });
        const attendanceDate = new Date(date);
        const records = await this.prisma.attendance.findMany({
            where: { groupId, date: attendanceDate },
        });
        const attendanceMap = new Map(records.map((r) => [r.studentId, r]));
        return groupStudents.map(({ student }) => ({
            student,
            attendance: attendanceMap.get(student.id) || null,
        }));
    }
    async getAnalytics(tenantId, from, to) {
        const dateFilter = from && to
            ? { gte: new Date(from), lte: new Date(to) }
            : undefined;
        const where = {
            group: { tenantId },
            ...(dateFilter && { date: dateFilter }),
        };
        const [total, byStatus] = await Promise.all([
            this.prisma.attendance.count({ where }),
            this.prisma.attendance.groupBy({
                by: ['status'],
                where,
                _count: true,
            }),
        ]);
        const statusMap = Object.fromEntries(byStatus.map((b) => [b.status, b._count]));
        const mostAbsent = await this.prisma.attendance.groupBy({
            by: ['studentId'],
            where: { ...where, status: index_1.AttendanceStatus.ABSENT },
            _count: true,
            orderBy: { _count: { studentId: 'desc' } },
            take: 10,
        });
        const absentStudentIds = mostAbsent.map((a) => a.studentId);
        const absentStudents = await this.prisma.student.findMany({
            where: { id: { in: absentStudentIds } },
            select: { id: true, firstName: true, lastName: true, avatar: true },
        });
        const studentMap = new Map(absentStudents.map((s) => [s.id, s]));
        return {
            total,
            attendanceRate: total > 0
                ? (((statusMap.PRESENT || 0) / total) * 100).toFixed(1)
                : '0',
            byStatus: statusMap,
            mostAbsentStudents: mostAbsent.map((a) => ({
                student: studentMap.get(a.studentId),
                absenceCount: a._count,
            })),
        };
    }
    async checkAbsenceLimit(studentIds, tenantId) {
        if (studentIds.length === 0)
            return;
        for (const studentId of studentIds) {
            const absenceCount = await this.prisma.attendance.count({
                where: { studentId, status: index_1.AttendanceStatus.ABSENT },
            });
            if (absenceCount > 10) {
                this.events.emit('student.absence_limit_exceeded', {
                    studentId,
                    absenceCount,
                    tenantId,
                });
            }
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map