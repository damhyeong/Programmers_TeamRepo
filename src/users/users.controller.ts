import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { EmailCheckDto } from "./dto/email-check.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags("users")
@Controller('users')
export class UsersController {
  constructor(private usersService : UsersService) {}

  @Post('/email-check')
  @ApiBody({
    type : EmailCheckDto
  })
  async emailCheck(@Body() emailCheckDto : EmailCheckDto) {
    const isAlreadySignup = await this.usersService.isAlreadySignup(emailCheckDto);

    if(isAlreadySignup) {
      throw new HttpException(
        {message : "이미 존재하는 이메일 계정입니다."},
        HttpStatus.BAD_REQUEST
      )
    } else {
      return {message : "사용 가능한 이메일입니다."};
    }
  }


  @Post('/signup')
  @ApiBody({
    type : SignUpDto,
  })
  async signUp(@Body() signupDto : SignUpDto) {
    const isSuccess =  await this.usersService.createUser(signupDto);

    if(isSuccess) {
      return {message : "회원가입 성공했습니다."}
    } else {
      return {message : "회원가입에 실패했습니다."}
    }
  }

  @Post('/login')
  @ApiBody({
    type : LoginDto
  })
  async login(@Body() loginDto: LoginDto) {
    const isValid = await this.usersService.userLogin(loginDto);

    if(isValid) {
      return {message : "로그인 성공했습니다."}
    } else {
      throw new HttpException(
        {message : "로그인 실패했습니다."},
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
