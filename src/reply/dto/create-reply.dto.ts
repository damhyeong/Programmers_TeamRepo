import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  parent_reply_id?: number;
}
