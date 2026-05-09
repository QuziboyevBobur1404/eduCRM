import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from './jwt.strategy';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    constructor(config: ConfigService);
    validate(req: Request, payload: JwtPayload): Promise<{
        refreshToken: any;
        sub: string;
        email: string;
        role: string;
        tenantId: string;
    }>;
}
export {};
