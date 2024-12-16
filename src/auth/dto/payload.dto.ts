import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PayloadDto {
  @IsNumber()
  @IsNotEmpty()
  sub : number;

  @IsNumber()
  @IsNotEmpty()
  username : string;

  @IsString()
  @IsNotEmpty()
  email : string;
}