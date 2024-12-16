import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description : "Email 형식을 따라야 합니다!",
    examples : ["testing2@gmail.com"]
  })
  email : string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description : "비밀번호 입력",
  })
  password : string;
}