import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsNumber, IsOptional,
  IsString, Matches, MaxLength, Min,
} from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Akbar' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Rahimov' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'akbar@educrm.uz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Teacher@12345' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @Matches(/^\+998[0-9]{9}$/, { message: "Telefon +998XXXXXXXXX formatida bo'lishi kerak" })
  phone?: string;

  @ApiPropertyOptional({ example: 'IELTS, Speaking' })
  @IsOptional() @IsString() @MaxLength(100)
  speciality?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ example: 3000000 })
  @IsOptional() @IsNumber() @Min(0)
  salary?: number;
}
