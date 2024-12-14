import { BadRequestException, Injectable } from '@nestjs/common';
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

  //   meeting_id 받아서 해당 모임 게시글만 내려주게 해야됨.
  async getManyPost() {
    return await this.postRepository.find();
  }

  async getPost(where: { id: number }) {
    const post = await this.postRepository.findOne({ where });
    if (!post) {
      throw new BadRequestException();
    }

    return post;
  }

  async modifyPost({
    where,
    data,
  }: {
    where: { id: number };
    data: ModifyPostDTO;
  }) {
    await this.getPost(where);

    return await this.postRepository.update(where, data);
  }

  async removePost(where: { id: number }) {
    await this.getPost(where);

    return await this.postRepository.delete(where);
  }
}
