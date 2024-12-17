import { Module } from '@nestjs/common';
import { MeetingUsersService } from './meeting-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingUsers } from './meeting-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingUsers])],
  providers: [MeetingUsersService],
  exports: [TypeOrmModule, MeetingUsersService],
})
export class MeetingUsersModule {}
