import { AttendanceStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FilterAttendanceDto extends PaginationDto {
    groupId?: string;
    studentId?: string;
    from?: string;
    to?: string;
    status?: AttendanceStatus;
}
