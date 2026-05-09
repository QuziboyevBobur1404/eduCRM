import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StudentStatus } from '../../common/enums/index';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @ApiPropertyOptional({ enum: StudentStatus })
  @IsOptional() @IsEnum(StudentStatus)
  status?: StudentStatus;
}
