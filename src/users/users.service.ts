import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { UsersEntity } from "./entity/users.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "./dto/sign-up.dto";
import { EmailCheckDto } from "./dto/email-check.dto";
import bcrypt from "bcrypt"
import { LoginDto } from "./dto/login.dto";


@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private usersRepository : Repository<UsersEntity>) {}

  async createUser(signUpDto : SignUpDto): Promise<Boolean> {
    const hashPwd = await bcrypt.hash(signUpDto.password, 10);

    await this.usersRepository.save({
      ...signUpDto,
      password : hashPwd
    });

    return true;
  }

  async isAlreadySignup(emailCheckDto : EmailCheckDto) : Promise<Boolean> {
    const email: string= emailCheckDto.email;

    const userEntity = await this.usersRepository.findOne({
      where : { email }
    });

    return (userEntity) ? true : false;
  }

  async userLogin(loginDto : LoginDto) : Promise<Boolean> {
    const email : string = loginDto.email

    const userEntity = await this.usersRepository.findOne({
      where : {email}
    });

    return await bcrypt.compare(loginDto.password, userEntity.password);
  }
}
