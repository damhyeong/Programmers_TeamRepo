import { Users } from "../entity/users.entity";
import { HttpException } from "@nestjs/common";

export class AfterDeleteUserDto {
  user : Users | null;
  error : HttpException | null;
}