import { Gender } from '../../common/enums/index';
export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    phone: string;
    parentPhone?: string;
    address?: string;
    birthDate?: string;
    gender: Gender;
    notes?: string;
}
