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
import { Users } from "./users/entity/users.entity";

@Module({
  imports: [
    UsersModule,
    TopicModule,
    MeetingModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Meeting, Topic, Users],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
