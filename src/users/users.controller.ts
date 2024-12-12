import { Body, Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { EmailCheckDto } from "./dto/email-check.dto";

@Controller('users')
export class UsersController {
  @Post('/email-check')
  emailCheck(@Body() emailCheckDto : EmailCheckDto) {

    return {message : "사용 가능한 이메일입니다."};
  }

  @Post('/signup')
  signUp() {

  }

  @Post('/login')
  login() {

  }
}
