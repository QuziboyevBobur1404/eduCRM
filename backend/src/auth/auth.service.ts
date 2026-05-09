import {
  BadRequestException,
  ForbiddenException,
  Injectable,
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
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // ── Login ─────────────────────────────────────────────────
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

    // Update last login
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

  // ── Register (Super Admin only) ───────────────────────────
  async register(dto: RegisterDto, tenantId: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role || Role.TEACHER,
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

    return user;
  }

  // ── Refresh tokens ────────────────────────────────────────
  async refreshTokens(userId: string, refreshToken: string) {
    const storedToken = await this.redis.getRefreshToken(userId);

    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati o\'tgan');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }

    return this.generateTokens(user.id, user.email, user.role, user.tenantId);
  }

  // ── Logout ────────────────────────────────────────────────
  async logout(userId: string) {
    await this.redis.deleteRefreshToken(userId);
    return { message: 'Muvaffaqiyatli chiqildi' };
  }

  // ── Get current user ──────────────────────────────────────
  async getMe(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        tenantId: true,
        lastLoginAt: true,
        createdAt: true,
        teacher: {
          select: {
            id: true,
            speciality: true,
            bio: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            logoUrl: true,
            primaryColor: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  // ── Change password ───────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Joriy parol noto\'g\'ri');
    }

    const hashedNew = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    // Invalidate all refresh tokens
    await this.redis.deleteRefreshToken(userId);

    return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }

  // ── Token generation helper ───────────────────────────────
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

    // Store refresh token in Redis (7 days = 604800 seconds)
    await this.redis.setRefreshToken(userId, refreshToken, 604800);

    return { accessToken, refreshToken };
  }
}
