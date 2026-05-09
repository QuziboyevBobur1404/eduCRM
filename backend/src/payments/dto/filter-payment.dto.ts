import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus } from '../../common/enums/index';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterPaymentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional() @IsEnum(PaymentStatus) status?: PaymentStatus;

  @ApiPropertyOptional() @IsOptional() @IsUUID() studentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() groupId?: string;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(12)
  month?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number) @IsInt() @Min(2020)
  year?: number;
}
