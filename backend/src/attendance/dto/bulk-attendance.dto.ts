import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../../common/enums/index';

export class AttendanceRecordDto {
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty({ enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  notes?: string;
}

export class BulkAttendanceDto {
  @ApiProperty()
  @IsUUID()
  groupId: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsInt()
  lessonNum: number;

  @ApiProperty({ type: [AttendanceRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records: AttendanceRecordDto[];
}
