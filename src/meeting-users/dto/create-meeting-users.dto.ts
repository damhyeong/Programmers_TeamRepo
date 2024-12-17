import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MeetingUserDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  meeting_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;
}
