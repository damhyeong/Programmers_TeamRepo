import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password : string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  target_password : string;
}