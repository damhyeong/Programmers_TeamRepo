import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Request,
  Post,
  Req,
  Res,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { EmailCheckDto } from './dto/email-check.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { PayloadDto } from '../auth/dto/payload.dto';
import { JwtHeaderTestDto } from './dto/jwt-header-test.dto';
import { ResponsePayloadDto } from '../auth/dto/response-payload.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/email-check')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: EmailCheckDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용 가능한 이메일일 때.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '이미 존재하는 이메일 계정이 있을 때.',
  })
  async emailCheck(@Body() emailCheckDto: EmailCheckDto) {
    const isAlreadySignup =
      await this.usersService.isAlreadySignup(emailCheckDto);

    if (isAlreadySignup) {
      throw new HttpException(
        { message: '이미 존재하는 이메일 계정입니다.' },
        HttpStatus.OK,
      );
    } else {
      return { message: '사용 가능한 이메일입니다.' };
    }
  }

  @Post('/signup')
  @ApiBody({
    type: SignUpDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '회원가입에 실패했을 때.',
  })
  async signUp(@Body() signupDto: SignUpDto) {
    const isSuccess = await this.usersService.createUser(signupDto);

    if (isSuccess) {
      return { message: '회원가입 성공했습니다.' };
    } else {
      throw new HttpException(
        {
          message: '회원가입에 실패했습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: 'asdhlfjkhasdl%^%*&^%&*askldfjzcnmv^.....',
  })
  async login(@Body() loginDto: LoginDto) {
    const { access_token, error } = await this.usersService.userLogin(loginDto);

    if (access_token) {
      return {
        message: '로그인 성공했습니다.',
        access_token: access_token,
      };
    } else {
      throw error;
    }
  }

  @Get('/jwt-test')
  @ApiHeader({
    name: 'Authorization',
    example: 'Bearer xxxxxxxxxxxxxxTokenValuexxxxxxx',
    description: 'JWT 검증시 꼭 필요한 속성.',
  })
  @ApiResponse({
    type: ResponsePayloadDto,
    description: '페이로드에 더 필요한 내용 있으시면 말씀해 주세요.(공담형)',
  })
  async jwtTest(@Request() req: Request) {
    const user = req['user'];

    // 미들웨어에서 "req['user']" 로 내부 파라미터의 정보를 담아놓음.
    if (user) {
      return user;
    } else {
      throw new HttpException(
        {
          message:
            '미들웨어 부분에서 에러를 잡아내지 못함. - 나온다면 즉시! 백엔드 연락 요망(공담형)',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @ApiBearerAuth('access-token')
  @Get('/me')
  async getUser(@Headers('authorization') token: string) {
    return await this.usersService.fetchUser(token.replace('Bearer ', ''));
  }
}
