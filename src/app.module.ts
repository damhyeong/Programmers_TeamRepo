import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TopicModule } from './topic/topic.module';
import { MeetingModule } from './meeting/meeting.module';
import { Topic } from './topic/topic.entity';
import { Meeting } from './meeting/meeting.entity';
import { Users } from './users/entity/users.entity';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { ReplyModule } from './reply/reply.module';
import { Posts } from './posts/posts.entity';
import { Reply } from './reply/reply.entity';
import { MeetingUsersModule } from './meeting-users/meeting-users.module';
import { MeetingUsers } from './meeting-users/meeting-users.entity';
import { ReplyLikesModule } from './reply-likes/reply-likes.module';
import { ReplyLikes } from './reply-likes/reply-likes.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Meeting, Topic, Posts, Reply, Users, MeetingUsers, ReplyLikes],
      synchronize: true,
      logging : true,
    }),
    UsersModule,
    TopicModule,
    MeetingModule,
    AuthModule,
    PostsModule,
    ReplyModule,
    MeetingUsersModule,
    ReplyLikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
