import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FilterGroupDto extends PaginationDto {
    courseId?: string;
    teacherId?: string;
    isActive?: boolean;
}
