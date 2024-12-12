import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmailCheckDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "이메일 주소",
    example : "test@gmail.com",
  })
  email : string;
}