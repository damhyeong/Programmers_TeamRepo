import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './meeting.entity';
import { JwtMiddleware } from 'src/common/middleware/jwt.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { PostsModule } from 'src/posts/posts.module';
import { MeetingUsersModule } from 'src/meeting-users/meeting-users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    AuthModule,
    forwardRef(() => PostsModule),
    MeetingUsersModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [TypeOrmModule, MeetingService],
})
export class MeetingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({
        path: '/meeting',
        method: RequestMethod.GET,
      })
      .forRoutes(MeetingController);
  }
}
