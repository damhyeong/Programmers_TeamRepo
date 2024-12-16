import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { ModifyPostDTO } from './dto/modify-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async createPost(data: CreatePostDTO): Promise<Posts> {
    const post = this.postRepository.create(data);

    return await this.postRepository.save(post);
  }

  async getManyPost(where?: { meeting_id?: number }) {
    const query = where?.meeting_id
      ? { meeting_id: where.meeting_id }
      : undefined;

    return await this.postRepository.find({
      where: query,
      order: { id: 'ASC' },
    });
  }

  async getPost(where: { id: number }) {
    const post = await this.postRepository.findOne({
      where,
      relations: ['replies'],
    });
    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async modifyPost({
    where,
    data,
    user_id,
  }: {
    where: { id: number };
    data: ModifyPostDTO;
    user_id: number;
  }) {
    await this.getPost(where);

    await this.postRepository.update(where, data);

    return { success: true };
  }

  async removePost({
    where,
    user_id,
  }: {
    where: { id: number };
    user_id: number;
  }) {
    await this.getPost(where);

    await this.postRepository.delete(where);

    return { success: true };
  }
}
