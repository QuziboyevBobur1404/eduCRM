import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tenantId: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        permissions: string[];
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string;
        teacher: {
            id: string;
        };
    }>;
    private buildPermissions;
}
export {};
