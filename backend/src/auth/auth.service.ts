import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/index';
import { Role } from '../common/enums/index';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async login(dto: LoginDto, ip?: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, deletedAt: null },
      include: { teacher: { select: { id: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Hisobingiz bloklangan. Admin bilan bog\'laning');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.tenantId);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        avatar: user.avatar,
        teacherId: user.teacher?.id || null,
      },
      ...tokens,
    };
  }

  async register(dto: RegisterDto, tenantId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: (dto.role as Role) || Role.TEACHER,
        tenantId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const storedToken = await this.redis.getRefreshToken(userId);
      if (storedToken && storedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token yaroqsiz');
      }
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      this.logger.warn('Redis unavailable during refresh, continuing...');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
    });

    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

    return this.generateTokens(user.id, user.email, user.role, user.tenantId);
  }

  async logout(userId: string) {
    try {
      await this.redis.deleteRefreshToken(userId);
    } catch {
      this.logger.warn('Redis unavailable during logout');
    }
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, avatar: true, role: true, tenantId: true,
        lastLoginAt: true, createdAt: true,
        teacher: { select: { id: true, speciality: true, bio: true } },
        tenant: {
          select: {
            id: true, name: true, slug: true,
            plan: true, logoUrl: true, primaryColor: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Joriy parol noto\'g\'ri');

    const hashedNew = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    try {
      await this.redis.deleteRefreshToken(userId);
    } catch {
      this.logger.warn('Redis unavailable during password change');
    }

    return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    tenantId: string,
  ) {
    const payload = { sub: userId, email, role, tenantId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // Redis xatosi bo'lsa ham login ishlayversin
    try {
      await this.redis.setRefreshToken(userId, refreshToken, 604800);
    } catch {
      this.logger.warn('Redis unavailable, refresh token not stored');
    }

    return { accessToken, refreshToken };
  }
}