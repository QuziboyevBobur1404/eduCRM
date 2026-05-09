import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterGroupDto extends PaginationDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() courseId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() teacherId?: string;
  @ApiPropertyOptional()
  @IsOptional() @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
