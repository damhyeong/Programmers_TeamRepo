import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reply } from './reply.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { ModifyReplyDTO } from './dto/modify-reply.dto';
import { PostsService } from 'src/posts/posts.service';
import { LIMIT } from 'src/common/constant/page';
import { AuthService } from 'src/auth/auth.service';
import { ReplyLikes } from 'src/reply-likes/reply-likes.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @Inject(forwardRef(() => PostsService))
    private postService: PostsService,
    private readonly authService: AuthService,
  ) {}

  async createReply(token: string, data: CreateReplyDTO): Promise<Reply> {
    const { sub } = await this.authService.verifyToken(token);

    await this.postService.getPost({ id: data.post_id });

    const reply = this.replyRepository.create({ user_id: sub, ...data });

    return await this.replyRepository.save(reply);
  }

  async getManyReply(where: { post_id: number; page: number }) {
    const SKIP = (where.page - 1) * LIMIT;
    const query = { post_id: where.post_id };

    const [data, total] = await this.replyRepository.findAndCount({
      where: query,
      take: LIMIT,
      skip: SKIP,
      order: { created_at: 'DESC' },
      relations: ['user', 'reply_likes', 'reply_likes.user'],
    });

    const transformedData = data.map((reply) => {
      const likes = reply.reply_likes.map((like) => ({
        user_id: like.user.id,
        username: like.user.username,
        profile_img: like.user.profile_img,
      }));

      delete reply.reply_likes;

      return {
        ...reply,
        user: new UserDto(reply.user),
        likes,
      };
    });

    return {
      replies: transformedData,
      total,
      currentPage: where.page,
      totalPages: Math.ceil(total / LIMIT),
    };
  }

  async getReply(where: { id: number }) {
    const reply = await this.replyRepository.findOne({
      where,
      relations: ['user'],
    });
    if (!reply) {
      throw new NotFoundException();
    }

    const transformedPost = {
      ...reply,
      user: new UserDto(reply.user),
    };

    return transformedPost;
  }

  async modifyReply({
    where,
    data,
    token,
  }: {
    where: { id: number };
    data: ModifyReplyDTO;
    token: string;
  }) {
    const reply = await this.getReply(where);
    const { sub } = await this.authService.verifyToken(token);
    if (reply.user_id !== sub) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }

    await this.replyRepository.update(where, data);

    return { success: true };
  }

  async removeReply({
    where,
    token,
  }: {
    where: { id: number };
    token: string;
  }) {
    const reply = await this.getReply(where);
    const { sub } = await this.authService.verifyToken(token);
    if (reply.user_id !== sub) {
      throw new UnauthorizedException('작성자만 삭제 가능합니다.');
    }

    await this.replyRepository.update(where.id, { is_show: false });

    return { success: true };
  }
}

export class UserDto {
  id: number;
  profile_img: string;
  username: string;

  constructor(user: Partial<UserDto>) {
    this.id = user.id;
    this.profile_img = user.profile_img;
    this.username = user.username;
  }
}

export class ReplyLikeDto {
  user_id: number;
  username: string;
  profile_img: string;

  constructor(like: ReplyLikes) {
    this.user_id = like.user.id;
    this.username = like.user.username;
    this.profile_img = like.user.profile_img;
  }
}
