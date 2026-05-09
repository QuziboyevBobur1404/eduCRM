import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  tenantId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, isActive: true, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, tenantId: true, avatar: true,
        teacher: { select: { id: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi topilmadi yoki bloklangan");
    }

    return { ...user, permissions: this.buildPermissions(user.role) };
  }

  private buildPermissions(role: string): string[] {
    const map: Record<string, string[]> = {
      SUPER_ADMIN: ['*'],
      ADMIN: [
        'student.create', 'student.read', 'student.update', 'student.delete',
        'teacher.create', 'teacher.read', 'teacher.update', 'teacher.delete',
        'group.create', 'group.read', 'group.update', 'group.delete',
        'attendance.create', 'attendance.read', 'attendance.update',
        'payment.create', 'payment.read', 'payment.update',
        'exam.create', 'exam.read', 'exam.update', 'exam.delete',
        'course.create', 'course.read', 'course.update', 'course.delete',
        'analytics.read', 'notification.read', 'audit.read',
        'user.read', 'user.update', 'user.delete',
      ],
      TEACHER: [
        'student.create', 'student.read',
        'group.read',
        'attendance.create', 'attendance.read',
        'exam.create', 'exam.read', 'exam.update',
        'notification.read',
      ],
    };
    return map[role] || [];
  }
}
