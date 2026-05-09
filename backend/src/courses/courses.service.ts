import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateCourseDto, UpdateCourseDto, FilterCourseDto } from './dto/index';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto, tenantId: string) {
    const existing = await this.prisma.course.findFirst({
      where: { name: dto.name, tenantId, deletedAt: null },
    });
    if (existing) throw new BadRequestException('Bu nomli kurs allaqachon mavjud');
    return this.prisma.course.create({ data: { ...dto, tenantId } });
  }

  async findAll(filters: FilterCourseDto, tenantId: string) {
    const { page = 1, limit = 20, search, isActive } = filters;
    const where: any = {
      tenantId,
      deletedAt: null,
      ...(isActive !== undefined && { isActive }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { groups: { where: { isActive: true, deletedAt: null } } },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        groups: {
          where: { isActive: true, deletedAt: null },
          include: {
            teacher: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
            },
            _count: { select: { students: { where: { isActive: true } } } },
          },
        },
        _count: { select: { groups: true } },
      },
    });
    if (!course) throw new NotFoundException('Kurs topilmadi');

    // ✅ FIX: groupIds orqali to'g'ri filter
    const groupIds = course.groups.map((g) => g.id);
    let totalRevenue = 0;
    if (groupIds.length > 0) {
      const revenue = await this.prisma.payment.aggregate({
        where: { groupId: { in: groupIds }, status: 'PAID' },
        _sum: { amount: true },
      });
      totalRevenue = Number(revenue._sum.amount || 0);
    }

    return {
      ...course,
      stats: {
        activeGroups: course.groups.length,
        totalStudents: course.groups.reduce((sum, g) => sum + g._count.students, 0),
        totalRevenue,
      },
    };
  }

  async update(id: string, dto: UpdateCourseDto, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string, tenantId: string) {
    const course = await this.findOne(id, tenantId);
    if ((course.groups?.length || 0) > 0) {
      throw new BadRequestException(
        `Bu kursda ${course.groups.length} ta faol guruh bor. Avval guruhlarni o'chiring.`,
      );
    }
    await this.prisma.course.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: "Kurs o'chirildi" };
  }
}
