import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender, StudentStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterStudentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: StudentStatus })
  @IsOptional() @IsEnum(StudentStatus)
  status?: StudentStatus;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  groupId?: string;
}
