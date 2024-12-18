import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { EmailCheckDto } from './dto/email-check.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';
import { PayloadDto } from '../auth/dto/payload.dto';
import { ModifyUserDTO } from './dto/modify-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private authService: AuthService,
  ) {}

  async createUser(signUpDto: SignUpDto): Promise<Boolean> {
    const hashPwd = await bcrypt.hash(signUpDto.password, 10);

    await this.usersRepository.save({
      ...signUpDto,
      password: hashPwd,
    });

    return true;
  }

  async isAlreadySignup(emailCheckDto: EmailCheckDto): Promise<Boolean> {
    const email: string = emailCheckDto.email;

    const userEntity = await this.usersRepository.findOne({
      where: { email },
    });

    return userEntity ? true : false;
  }

  async userLogin(
    loginDto: LoginDto,
  ): Promise<{ access_token: string | null }> {
    const email: string = loginDto.email;

    const userEntity = await this.usersRepository.findOne({
      where: { email },
    });

    const isSuccess = await bcrypt.compare(
      loginDto.password,
      userEntity.password,
    );

    const result = {
      access_token: null,
    };

    if (isSuccess) {
      const payload: PayloadDto = {
        sub: userEntity.id,
        username: userEntity.username,
        email: userEntity.email,
      };
      result['access_token'] = await this.authService.makeAccessToken(payload);
    }

    return result;
  }

  async findManyMeeting(token: string) {
    const { sub } = await this.authService.verifyToken(token);

    const user = await this.usersRepository.findOne({
      where: { id: sub },
      relations: ['meetings'],
    });

    const { password, ...data } = user;
    return {
      user: data,
      meetings: user.meetings,
    };
  }

  async findUser(where: { id: number }) {
    const user = await this.usersRepository.find({ where });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async modifyUser({ token, data }: { token: string; data: ModifyUserDTO }) {
    const { sub } = await this.authService.verifyToken(token);
    await this.findUser({ id: sub });

    await this.usersRepository.update({ id: sub }, data);

    return { success: true };
  }
}
