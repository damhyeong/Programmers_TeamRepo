import { Module } from '@nestjs/common';
import { MeetingUsersService } from './meeting-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingUsers } from './meeting-users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingUsers]), AuthModule],
  providers: [MeetingUsersService],
  exports: [TypeOrmModule, MeetingUsersService],
})
export class MeetingUsersModule {}
