import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/index';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request, res: Response): Promise<{
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
        accessToken: string;
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
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>> | {
        accessToken: string;
    }>;
    logout(userId: string, res: Response): Promise<{
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
}
