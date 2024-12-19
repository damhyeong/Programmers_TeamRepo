import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyLikes } from './reply-likes.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ReplyLikesService {
  constructor(
    @InjectRepository(ReplyLikes)
    private replyLikeRepository: Repository<ReplyLikes>,
    private authService: AuthService,
  ) {}

  async createReplyLike(token: string, reply_id: number) {
    const { sub } = await this.authService.verifyToken(token);

    const data = this.replyLikeRepository.create({ user_id: sub, reply_id });
    await this.replyLikeRepository.save(data);

    return { success: true };
  }
}
