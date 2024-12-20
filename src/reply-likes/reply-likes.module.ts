import { Module } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyLikes } from './reply-likes.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ReplyLikesController } from "./reply-likes.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ReplyLikes]), AuthModule],
  controllers : [ReplyLikesController],
  providers: [ReplyLikesService],
  exports: [TypeOrmModule, ReplyLikesService],
})
export class ReplyLikesModule {}
