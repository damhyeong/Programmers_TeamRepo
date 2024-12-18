import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMeetingUserDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
