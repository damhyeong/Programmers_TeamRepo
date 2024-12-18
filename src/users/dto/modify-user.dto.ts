import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ModifyUserDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  profile_img: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  introduction: string;
}
