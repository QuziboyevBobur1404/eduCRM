import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({ example: 1, description: '0=Yak, 1=Dush, 2=Sesh, 3=Chor, 4=Pay, 5=Juma, 6=Shan' })
  @IsInt() @Min(0) @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '11:00' })
  @IsString()
  endTime: string;
}
