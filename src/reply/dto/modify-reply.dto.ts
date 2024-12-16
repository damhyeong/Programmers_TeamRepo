import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyReplyDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
