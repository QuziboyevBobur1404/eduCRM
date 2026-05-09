import { Gender, StudentStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FilterStudentDto extends PaginationDto {
    status?: StudentStatus;
    gender?: Gender;
    groupId?: string;
}
