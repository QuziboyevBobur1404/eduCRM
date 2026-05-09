import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@educrm.uz' })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  email: string;

  @ApiProperty({ example: 'Admin@12345' })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak" })
  password: string;
}
