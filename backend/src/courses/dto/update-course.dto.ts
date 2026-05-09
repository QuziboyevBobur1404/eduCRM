import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) duration?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() level?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) monthlyPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
