import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description : "Email 형식을 갖춰야 합니다",
    example : "test@gmail.com"
  })
  email : string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description : "Password",
    example : "password1234"
  })
  password : string;
}