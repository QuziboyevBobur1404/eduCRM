import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { AttendanceStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterAttendanceDto extends PaginationDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() groupId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() studentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to?: string;
  @ApiPropertyOptional({ enum: AttendanceStatus })
  @IsOptional() @IsEnum(AttendanceStatus) status?: AttendanceStatus;
}
