import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { Reply } from './reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import { ReplyLikesModule } from 'src/reply-likes/reply-likes.module';
import { JwtMiddleware } from '../common/middleware/jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply]),
    forwardRef(() => PostsModule),
    AuthModule,
    ReplyLikesModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [TypeOrmModule, ReplyService],
})
export class ReplyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({
        path: 'replies/database',
        method: RequestMethod.GET,
      })
      .forRoutes(ReplyController);
  }
}
