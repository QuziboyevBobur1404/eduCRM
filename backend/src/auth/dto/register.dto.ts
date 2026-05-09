import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { Role } from '../../common/enums/index';

export class RegisterDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'ali@educrm.uz' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin@12345' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])/, {
    message: "Parol kamida 1 ta katta harf va 1 ta raqam bo'lishi kerak",
  })
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.TEACHER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
