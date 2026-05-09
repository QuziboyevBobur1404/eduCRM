import { PaymentMethod } from '../../common/enums/index';
export declare class CreatePaymentDto {
    studentId: string;
    groupId: string;
    amount: number;
    method: PaymentMethod;
    month: number;
    year: number;
    notes?: string;
}
