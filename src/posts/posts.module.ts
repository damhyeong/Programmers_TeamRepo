import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyModule } from 'src/reply/reply.module';
import { AuthModule } from 'src/auth/auth.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { JwtMiddleware } from '../common/middleware/jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    forwardRef(() => ReplyModule),
    AuthModule,
    forwardRef(() => MeetingModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [TypeOrmModule, PostsService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        {
          path: 'posts',
          method: RequestMethod.GET,
        },
        {
          path: 'posts/:id/reply',
          method: RequestMethod.GET,
        },
        {
          path: 'posts/:id',
          method: RequestMethod.GET,
        },
      )
      .forRoutes(PostsController);
  }
}
