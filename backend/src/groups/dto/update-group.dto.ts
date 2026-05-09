import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateGroupDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() teacherId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(50) capacity?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() roomNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
