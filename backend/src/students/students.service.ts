import {
  BadRequestException, Injectable, NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StudentStatus } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto } from './dto/filter-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private events: EventEmitter2,
  ) {}

  async create(dto: CreateStudentDto, tenantId: string, createdById: string) {
    const existing = await this.prisma.student.findFirst({
      where: { phone: dto.phone, tenantId, deletedAt: null },
    });
    if (existing) {
      throw new BadRequestException("Bu telefon raqam allaqachon ro'yxatda bor");
    }

    const student = await this.prisma.student.create({
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        tenantId,
        createdById,
      },
    });

    this.events.emit('student.created', { student, tenantId });
    return student;
  }

  async findAll(filters: FilterStudentDto, tenantId: string) {
    const {
      page = 1, limit = 20, search, status,
      gender, groupId, sortBy, sortOrder,
    } = filters;

    const where: any = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(gender && { gender }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
      ...(groupId && {
        groupStudents: { some: { groupId, isActive: true } },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder || 'desc' },
        select: {
          id: true, firstName: true, lastName: true,
          phone: true, parentPhone: true, avatar: true,
          gender: true, status: true, joinedDate: true, createdAt: true,
          groupStudents: {
            where: { isActive: true },
            select: {
              group: {
                select: {
                  id: true, name: true,
                  course: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.student.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        groupStudents: {
          where: { isActive: true },
          include: {
            group: {
              include: {
                course: true,
                teacher: {
                  include: {
                    user: { select: { firstName: true, lastName: true } },
                  },
                },
                schedules: true,
              },
            },
          },
        },
      },
    });

    if (!student) throw new NotFoundException("O'quvchi topilmadi");
    return student;
  }

  async update(
    id: string,
    dto: UpdateStudentDto,
    tenantId: string,
    updatedById: string,
  ) {
    const before = await this.findOne(id, tenantId);

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });

    this.events.emit('student.updated', {
      before,
      after: updated,
      userId: updatedById,
      tenantId,
    });

    return updated;
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { message: "O'quvchi o'chirildi" };
  }

  async getAttendanceHistory(id: string, tenantId: string, query: any) {
    await this.findOne(id, tenantId);
    const { from, to, groupId, page = 1, limit = 30 } = query;

    const where: any = {
      studentId: id,
      ...(from && to && { date: { gte: new Date(from), lte: new Date(to) } }),
      ...(groupId && { groupId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip: (page - 1) * limit,
        take: +limit,
        orderBy: { date: 'desc' },
        include: { group: { select: { id: true, name: true } } },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    const stats = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: { studentId: id },
      _count: true,
    });

    return {
      data,
      meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) },
      stats: Object.fromEntries(stats.map((s) => [s.status, s._count])),
    };
  }

  async getPaymentHistory(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.payment.findMany({
      where: { studentId: id, tenantId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async getExamHistory(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.examResult.findMany({
      where: { studentId: id },
      include: {
        exam: {
          include: { group: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async autoInactivateByAbsences() {
    const studentsToInactivate = await this.prisma.$queryRaw<
      { studentId: string }[]
    >`
      SELECT "studentId"
      FROM attendances
      WHERE status = 'ABSENT'
      GROUP BY "studentId"
      HAVING COUNT(*) > 10
    `;

    if (studentsToInactivate.length === 0) return 0;

    const ids = studentsToInactivate.map((s) => s.studentId);
    const result = await this.prisma.student.updateMany({
      where: { id: { in: ids }, status: StudentStatus.ACTIVE },
      data: { status: StudentStatus.INACTIVE },
    });

    for (const { studentId } of studentsToInactivate) {
      this.events.emit('student.auto_inactivated', { studentId });
    }

    return result.count;
  }
}
