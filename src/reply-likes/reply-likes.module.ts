import { Module } from '@nestjs/common';
import { ReplyLikesService } from './reply-likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyLikes } from './reply-likes.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReplyLikes]), AuthModule],
  providers: [ReplyLikesService],
  exports: [TypeOrmModule, ReplyLikesService],
})
export class ReplyLikesModule {}
