import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AttendanceStatus } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { BulkAttendanceDto, FilterAttendanceDto } from './dto/index';
import { PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  // ── Bulk create / update attendance ───────────────────────
  async bulkCreate(dto: BulkAttendanceDto, takenById: string, tenantId: string) {
    const { groupId, date, lessonNum, records } = dto;
    const attendanceDate = new Date(date);

    // Upsert each attendance record
    const results = await Promise.all(
      records.map((record) =>
        this.prisma.attendance.upsert({
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
        }),
      ),
    );

    // Emit for real-time update
    this.events.emit('attendance.bulk_created', {
      groupId,
      date: attendanceDate,
      records: results,
      tenantId,
    });

    // Check for students exceeding absence limit
    await this.checkAbsenceLimit(
      records.filter((r) => r.status === AttendanceStatus.ABSENT).map((r) => r.studentId),
      tenantId,
    );

    return results;
  }

  // ── Get attendance list ───────────────────────────────────
  async findAll(filters: FilterAttendanceDto, tenantId: string) {
    const { page = 1, limit = 50, groupId, studentId, from, to, status } = filters;

    const where: any = {
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

    return new PaginatedResult(data, total, page, limit);
  }

  // ── Get group attendance for a specific date ──────────────
  async getGroupAttendance(groupId: string, date: string, tenantId: string) {
    // Get all active students in group
    const groupStudents = await this.prisma.groupStudent.findMany({
      where: { groupId, isActive: true },
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Get attendance records for that date
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

  // ── Analytics ─────────────────────────────────────────────
  async getAnalytics(tenantId: string, from?: string, to?: string) {
    const dateFilter = from && to
      ? { gte: new Date(from), lte: new Date(to) }
      : undefined;

    const where = {
      group: { tenantId },
      ...(dateFilter && { date: dateFilter }),
    };

    // Overall stats
    const [total, byStatus] = await Promise.all([
      this.prisma.attendance.count({ where }),
      this.prisma.attendance.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
    ]);

    const statusMap = Object.fromEntries(
      byStatus.map((b) => [b.status, b._count]),
    );

    // Most absent students
    const mostAbsent = await this.prisma.attendance.groupBy({
      by: ['studentId'],
      where: { ...where, status: AttendanceStatus.ABSENT },
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

  // ── Check absence limit (auto-inactivate trigger) ─────────
  private async checkAbsenceLimit(studentIds: string[], tenantId: string) {
    if (studentIds.length === 0) return;

    for (const studentId of studentIds) {
      const absenceCount = await this.prisma.attendance.count({
        where: { studentId, status: AttendanceStatus.ABSENT },
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
}
