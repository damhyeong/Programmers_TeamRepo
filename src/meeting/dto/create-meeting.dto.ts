import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsOptional()
  max_members: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  end_date: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender_condition: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age_condition: string;
}
