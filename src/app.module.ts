import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TopicsModule } from './topics/topics.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { RoomUsersModule } from './room-users/room-users.module';

@Module({
  imports: [UsersModule, TopicsModule, RoomsModule, MessagesModule, RoomUsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
