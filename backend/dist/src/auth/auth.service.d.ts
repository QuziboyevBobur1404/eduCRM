import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/index';
export declare class AuthService {
    private prisma;
    private redis;
    private jwt;
    private config;
    constructor(prisma: PrismaService, redis: RedisService, jwt: JwtService, config: ConfigService);
    login(dto: LoginDto, ip?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            tenantId: string;
            avatar: string;
            teacherId: string;
        };
    }>;
    register(dto: RegisterDto, tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        createdAt: Date;
        tenant: {
            id: string;
            slug: string;
            name: string;
            plan: import(".prisma/client").$Enums.Plan;
            logoUrl: string;
            primaryColor: string;
        };
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string;
        lastLoginAt: Date;
        teacher: {
            id: string;
            speciality: string;
            bio: string;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateTokens;
}
