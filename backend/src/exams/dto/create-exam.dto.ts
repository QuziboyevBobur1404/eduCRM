import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ example: 'Oylik test #1' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 100 })
  @IsNumber() @Min(1)
  maxScore: number;

  @ApiProperty({ example: '2025-03-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;
}
