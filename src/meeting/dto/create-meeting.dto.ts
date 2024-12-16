import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MeetingDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  topic_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  max_members: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender_condition: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  age_condition: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  owner_user_id: number;
}
