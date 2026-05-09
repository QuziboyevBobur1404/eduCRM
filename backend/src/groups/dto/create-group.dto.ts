import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'IELTS Beginner N12' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsUUID()
  courseId: string;

  @ApiProperty()
  @IsUUID()
  teacherId: string;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional() @IsInt() @Min(1) @Max(50)
  capacity?: number;

  @ApiPropertyOptional({ example: '101' })
  @IsOptional() @IsString()
  roomNumber?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsDateString()
  endDate?: string;
}
