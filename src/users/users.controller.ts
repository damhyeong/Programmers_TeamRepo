import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Request,
  Post,
  Put,
  Req,
  Res,
  HttpCode,
  Headers, Delete
} from "@nestjs/common";
import { EmailCheckDto } from "./dto/email-check.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { LoginDto } from "./dto/login.dto";
import { ResponsePayloadDto } from "../auth/dto/response-payload.dto";
import { ModifyUserDTO } from "./dto/modify-user.dto";
import { AuthService } from "../auth/auth.service";

@ApiTags ("users")
@Controller ("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {
  }

  @Post ("/email-check")
  @HttpCode (HttpStatus.OK)
  @ApiBody ({
    type: EmailCheckDto
  })
  @ApiResponse ({
    status: HttpStatus.OK,
    description: "사용 가능한 이메일일 때."
  })
  @ApiResponse ({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: "이미 존재하는 이메일 계정이 있을 때."
  })
  async emailCheck(@Body () emailCheckDto: EmailCheckDto) {
    const isAlreadySignup =
      await this.usersService.isAlreadySignup (emailCheckDto);

    if (isAlreadySignup) {
      throw new HttpException (
        { message: "이미 존재하는 이메일 계정입니다." },
        HttpStatus.NOT_ACCEPTABLE
      );
    } else {
      return { message: "사용 가능한 이메일입니다." };
    }
  }

  @Post ("/signup")
  @ApiBody ({
    type: SignUpDto
  })
  @ApiResponse ({
    status: HttpStatus.CREATED,
    description: "회원가입에 성공했을 때"
  })
  @ApiResponse ({
    status: HttpStatus.BAD_REQUEST,
    description: "회원가입에 실패했을 때."
  })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body () signupDto: SignUpDto) {
    const isSuccess = await this.usersService.createUser (signupDto);

    if (isSuccess) {
      return { message: "회원가입 성공했습니다." };
    } else {
      throw new HttpException (
        {
          message: "회원가입에 실패했습니다."
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post ("/login")
  @ApiBody ({
    type: LoginDto
  })
  @ApiResponse ({
    status: HttpStatus.OK,
    example: "asdhlfjkhasdl%^%*&^%&*askldfjzcnmv^....."
  })
  @ApiResponse ({
    status : HttpStatus.NOT_FOUND,
    description : "해당 이메일 아이디는 존재하지 않음"
  })
  @ApiResponse ({
    status : HttpStatus.UNAUTHORIZED,
    description : "비밀번호가 일치하지 않음."
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body () loginDto: LoginDto) {
    const { access_token, error } = await this.usersService.userLogin (loginDto);

    if (access_token) {
      const user_info = await this.authService.verifyToken (access_token);

      return {
        message: "로그인 성공했습니다.",
        access_token: access_token,
        user_info: user_info
      };
    } else {
      throw error;
    }
  }

  @Get ("/jwt-test")
  @ApiHeader ({
    name: "Authorization",
    example: "Bearer xxxxxxxxxxxxxxTokenValuexxxxxxx",
    description: "JWT 검증시 꼭 필요한 속성."
  })
  @ApiResponse ({
    type: ResponsePayloadDto,
    description: "페이로드에 더 필요한 내용 있으시면 말씀해 주세요.(공담형)"
  })
  async jwtTest(@Request () req: Request) {
    const user = req["user"];

    // 미들웨어에서 "req['user']" 로 내부 파라미터의 정보를 담아놓음.
    if (user) {
      return user;
    } else {
      throw new HttpException (
        {
          message:
            "미들웨어 부분에서 에러를 잡아내지 못함. - 나온다면 즉시! 백엔드 연락 요망(공담형)"
        },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
  }

  @ApiBearerAuth("access-token")
  @Get (":id/meeting")
  async getManyMeeting(@Headers ("authorization") token: string) {
    return await this.usersService.findManyMeeting (
      token.replace ("Bearer ", "")
    );
  }

  @ApiBearerAuth("access")
  @Get("/meetings")
  async getParticipateMeeting(@Headers("authorization") token : string) {
    const {user, meeting_users, error} = await this.usersService.findParticipateMeeting(token.replace("Bearer ", ""));

    if(error){
      return error;
    }

    return {
      user : user,
      meeting_users : meeting_users
    }
  }


  @ApiBearerAuth ("access-token")
  @ApiBody ({ type: ModifyUserDTO })
  @Put ("/me")
  @HttpCode(HttpStatus.ACCEPTED)
  async putUser(
    @Headers ("authorization") token: string,
    @Body () body: ModifyUserDTO
  ) {

    return await this.usersService.modifyUser ({
      token: token.replace ("Bearer ", ""),
      data: body
    });
  }

  @ApiBearerAuth ("access-token")
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async getUser(@Headers('authorization') token: string) {
    return await this.usersService.fetchUser(token.replace('Bearer ', ''));
  }

  @ApiBearerAuth ("access-token")
  @ApiResponse({
    status : HttpStatus.ACCEPTED,
    description : "유저가 사이트를 탈퇴하는데 성공!"
  })
  @ApiResponse({
    status : HttpStatus.NOT_FOUND,
    description : "JWT 페이로드에 포함된 user 의 id 가 데이터베이스에 존재하지 않을 때 발생하는 에러"
  })
  @ApiResponse({
    status : HttpStatus.UNAUTHORIZED,
    description : "JWT 검증 미들웨어에서 걸러졌으므로, 형태가 망가졌거나 기한이 끝났기에 나오는 에러"
  })
  @Delete ('/me')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteUser(@Headers('authorization') token : string) {
    const {user, error} =  await this.usersService.deleteUser(token.replace('Bearer ', ''));

    return !user ? error : {
      message : "그동안 서비스를 이용해주셔서 감사합니다."
    }
  }
}
