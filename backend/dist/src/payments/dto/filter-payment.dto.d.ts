import { PaymentStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FilterPaymentDto extends PaginationDto {
    status?: PaymentStatus;
    studentId?: string;
    groupId?: string;
    month?: number;
    year?: number;
}
