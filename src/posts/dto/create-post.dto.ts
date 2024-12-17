import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  meeting_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  img: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
