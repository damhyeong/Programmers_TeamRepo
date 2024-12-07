import { Module } from '@nestjs/common';
import { RoomUsersController } from './room-users.controller';
import { RoomUsersService } from './room-users.service';

@Module({
  controllers: [RoomUsersController],
  providers: [RoomUsersService]
})
export class RoomUsersModule {}
