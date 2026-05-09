import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString, IsEnum, IsOptional,
  IsString, Matches, MaxLength,
} from 'class-validator';
import { Gender } from '../../common/enums/index';

export class CreateStudentDto {
  @ApiProperty({ example: 'Jasur' })
  @IsString() @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Toshmatov' })
  @IsString() @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @Matches(/^\+998[0-9]{9}$/, {
    message: "Telefon raqam +998XXXXXXXXX formatida bo'lishi kerak",
  })
  phone: string;

  @ApiPropertyOptional({ example: '+998901234568' })
  @IsOptional() @IsString()
  parentPhone?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '2005-03-15' })
  @IsOptional() @IsDateString()
  birthDate?: string;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(500)
  notes?: string;
}
