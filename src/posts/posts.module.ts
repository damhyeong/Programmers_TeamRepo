import { forwardRef, Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyModule } from 'src/reply/reply.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), forwardRef(() => ReplyModule)],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [TypeOrmModule, PostsService],
})
export class PostsModule {}
