import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { PaymentMethod } from '../../common/enums/index';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  studentId: string;

  @ApiProperty()
  @IsUUID()
  groupId: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 1, description: '1-12' })
  @IsInt() @Min(1) @Max(12)
  month: number;

  @ApiProperty({ example: 2025 })
  @IsInt() @Min(2020)
  year: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  notes?: string;
}
