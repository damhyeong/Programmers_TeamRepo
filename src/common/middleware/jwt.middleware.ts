import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import {Request, Response, NextFunction} from "express";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private authService : AuthService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(request);

    if(!token){
      throw new UnauthorizedException({
        message : "헤더에 토큰이 없거나, 앞에 'Bearer ' 가 붙지 않음."
      })
    }

    try {
      const payload = await this.authService.verifyToken(token);

      request["user"] = payload;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException({
        message : "토큰 기한 만료 or 토큰의 형태가 망가짐."
      });
    }

    // JwtMiddleware 함수 마무리 및 다음 미들웨어 혹은 컨트롤러로 전달
    next();
  }

  // "Authorization" 헤더 내부의 토큰 접두어로 Bearer 가 있어야 함.
  private extractTokenFromHeader(request : Request) : string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === "Bearer" ? token : null;
  }
}