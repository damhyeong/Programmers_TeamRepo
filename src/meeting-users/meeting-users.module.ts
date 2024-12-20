import { forwardRef, Module } from '@nestjs/common';
import { MeetingUsersService } from './meeting-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingUsers } from './meeting-users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { MeetingUsersController } from "./meeting-users.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingUsers]),
    AuthModule,
    forwardRef(() => MeetingModule),
  ],
  controllers : [MeetingUsersController],
  providers: [MeetingUsersService],
  exports: [TypeOrmModule, MeetingUsersService],
})
export class MeetingUsersModule {}
