import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reply } from './reply.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { ModifyReplyDTO } from './dto/modify-reply.dto';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
    @Inject(forwardRef(() => PostsService))
    private postService: PostsService,
  ) {}

  async createReply(data: CreateReplyDTO): Promise<Reply> {
    await this.postService.getPost({ id: data.post_id });

    const reply = this.replyRepository.create(data);

    return await this.replyRepository.save(reply);
  }

  async getManyReply(where: { post_id: number }) {
    return await this.replyRepository.find({ where });
  }

  async getReply(where: { id: number }) {
    const reply = await this.replyRepository.findOne({ where });
    if (!reply) {
      throw new NotFoundException();
    }

    return reply;
  }
  //  본인 확인 필요
  async modifyReply({
    where,
    data,
    user_id,
  }: {
    where: { id: number };
    data: ModifyReplyDTO;
    user_id: number;
  }) {
    const reply = await this.getReply(where);
    if (reply.user_id !== user_id) {
      throw new BadRequestException();
    }

    await this.replyRepository.update(where, data);

    return { success: true };
  }

  //   본인 확인 필요
  async removeReply({
    where,
    user_id,
  }: {
    where: { id: number };
    user_id: number;
  }) {
    const reply = await this.getReply(where);
    if (reply.user_id !== user_id) {
      throw new BadRequestException();
    }

    await this.replyRepository.delete(where);

    return { success: true };
  }
}
