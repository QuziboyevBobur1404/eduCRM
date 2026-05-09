import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'IELTS' })
  @IsString() @MaxLength(100)
  name: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 6, description: 'Oylar soni' })
  @IsInt() @Min(1)
  duration: number;

  @ApiPropertyOptional({ example: 'Intermediate' })
  @IsOptional() @IsString()
  level?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber() @Min(0)
  monthlyPrice: number;
}
