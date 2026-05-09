import { Role } from '../../common/enums/index';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    phone?: string;
}
