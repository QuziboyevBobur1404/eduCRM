import {
  BadRequestException, Injectable, NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTeacherDto, tenantId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException("Bu email allaqachon ro'yxatdan o'tgan");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: Role.TEACHER,
        tenantId,
      },
    });

    const teacher = await this.prisma.teacher.create({
      data: {
        userId: user.id,
        tenantId,
        speciality: dto.speciality,
        bio: dto.bio,
        salary: dto.salary,
      },
      include: {
        user: {
          select: {
            id: true, email: true, firstName: true,
            lastName: true, phone: true, avatar: true,
          },
        },
      },
    });

    return teacher;
  }

  async findAll(filters: FilterTeacherDto, tenantId: string) {
    const { page = 1, limit = 20, search, isActive } = filters;

    const where: any = {
      tenantId,
      deletedAt: null,
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        user: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true, email: true, firstName: true,
              lastName: true, phone: true, avatar: true,
            },
          },
          _count: { select: { groups: true } },
        },
      }),
      this.prisma.teacher.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true, email: true, firstName: true, lastName: true,
            phone: true, avatar: true, lastLoginAt: true,
          },
        },
        groups: {
          where: { isActive: true },
          include: {
            course: { select: { name: true } },
            _count: { select: { students: true } },
            schedules: true,
          },
        },
      },
    });

    if (!teacher) throw new NotFoundException("O'qituvchi topilmadi");
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto, tenantId: string) {
    const teacher = await this.findOne(id, tenantId);

    const { firstName, lastName, phone, ...teacherData } = dto as any;

    if (firstName || lastName || phone) {
      await this.prisma.user.update({
        where: { id: teacher.user.id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(phone && { phone }),
        },
      });
    }

    return this.prisma.teacher.update({
      where: { id },
      data: teacherData,
      include: {
        user: {
          select: {
            id: true, email: true, firstName: true,
            lastName: true, phone: true, avatar: true,
          },
        },
      },
    });
  }

  async remove(id: string, tenantId: string) {
    const teacher = await this.findOne(id, tenantId);

    const activeGroups = await this.prisma.group.count({
      where: { teacherId: id, isActive: true },
    });
    if (activeGroups > 0) {
      throw new BadRequestException(
        `O'qituvchining ${activeGroups} ta faol guruhi bor. Avval guruhlarni boshqa o'qituvchiga o'tkazing`,
      );
    }

    await this.prisma.teacher.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    await this.prisma.user.update({
      where: { id: teacher.user.id },
      data: { isActive: false },
    });

    return { message: "O'qituvchi o'chirildi" };
  }

  async getStats(id: string, tenantId: string) {
    await this.findOne(id, tenantId);

    const groups = await this.prisma.group.findMany({
      where: { teacherId: id, isActive: true },
      select: { id: true },
    });
    const groupIds = groups.map((g) => g.id);

    const [totalStudents, totalAttendance, presentCount] = await Promise.all([
      this.prisma.groupStudent.count({
        where: { groupId: { in: groupIds }, isActive: true },
      }),
      this.prisma.attendance.count({
        where: { groupId: { in: groupIds } },
      }),
      this.prisma.attendance.count({
        where: { groupId: { in: groupIds }, status: 'PRESENT' },
      }),
    ]);

    return {
      activeGroups: groups.length,
      totalStudents,
      attendanceRate:
        totalAttendance > 0
          ? ((presentCount / totalAttendance) * 100).toFixed(1)
          : '0',
    };
  }
}
