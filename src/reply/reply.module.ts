import { forwardRef, Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { Reply } from './reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), forwardRef(() => PostsModule)],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [TypeOrmModule],
})
export class ReplyModule {}
