import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadDto } from './dto/payload.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async makeAccessToken(payload: PayloadDto) {
    return await this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    return payload;
  }

  async replaceAndVerify(token : string) {
    const replacedToken = token.replace("Bearer ", "");

    const payload = await this.jwtService.verifyAsync(replacedToken, {
      secret: jwtConstants.secret,
    });

    return payload;
  }
}
