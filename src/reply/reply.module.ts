import { forwardRef, Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { Reply } from './reply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply]),
    forwardRef(() => PostsModule),
    AuthModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [TypeOrmModule, ReplyService],
})
export class ReplyModule {}
