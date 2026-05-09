import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/index';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, page = 1, limit = 20, role?: Role) {
    const where: any = {
      tenantId,
      deletedAt: null,
      ...(role && { role }),
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, avatar: true, role: true, isActive: true,
          lastLoginAt: true, createdAt: true,
          teacher: { select: { id: true, speciality: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true, isActive: true,
        lastLoginAt: true, createdAt: true,
        teacher: true,
      },
    });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async updateProfile(
    id: string,
    tenantId: string,
    data: { firstName?: string; lastName?: string; phone?: string },
  ) {
    await this.findOne(id, tenantId);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phone && { phone: data.phone }),
      },
      select: {
        id: true, email: true, firstName: true,
        lastName: true, phone: true, avatar: true, role: true,
      },
    });
  }

  async toggleActive(id: string, tenantId: string) {
    const user = await this.findOne(id, tenantId);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: !(user as any).isActive },
      select: { id: true, isActive: true },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { message: "Foydalanuvchi o'chirildi" };
  }
}
