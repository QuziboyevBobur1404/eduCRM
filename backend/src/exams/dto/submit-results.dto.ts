import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExamResultItemDto {
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty()
  @IsNumber() @Min(0)
  score: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  notes?: string;
}

export class SubmitExamResultsDto {
  @ApiProperty({ type: [ExamResultItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamResultItemDto)
  results: ExamResultItemDto[];
}
