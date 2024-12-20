import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDTO } from './dto/create-post.dto';
import { ModifyPostDTO } from './dto/modify-post.dto';
import { AuthService } from 'src/auth/auth.service';
import { LIMIT } from 'src/common/constant/page';
import { MeetingService } from 'src/meeting/meeting.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    private readonly authService: AuthService,
    private readonly meetingService: MeetingService,
  ) {}

  async createPost(token: string, data: CreatePostDTO): Promise<Posts> {
    const { sub } = await this.authService.verifyToken(token);
    const meeting = await this.meetingService.findMeeting({
      id: data.meeting_id,
    });

    const meetingUser = meeting.meeting_users.find(
      (user) => user.user_id === sub,
    );
    if (!meetingUser || !meetingUser.is_active) {
      throw new UnauthorizedException(
        '퇴출된 사용자입니다. 글을 작성할 수 없습니다.',
      );
    }

    const post = this.postRepository.create({ user_id: sub, ...data });

    return await this.postRepository.save(post);
  }

  async getManyPost(where: { meeting_id: number; page: number }) {
    const SKIP = (where.page - 1) * LIMIT;
    const query = { meeting_id: where.meeting_id };

    const [data, total] = await this.postRepository.findAndCount({
      where: query,
      take: LIMIT,
      skip: SKIP,
      order: { created_at: 'DESC' },
      relations: ['user'],
    });

    const transformedData = data.map((post) => ({
      ...post,
      user: new UserDto(post.user),
    }));

    return {
      posts: transformedData,
      total,
      currentPage: where.page,
      totalPages: Math.ceil(total / LIMIT),
    };
  }

  async getPost(where: { id: number }) {
    const post = await this.postRepository.findOne({
      where,
      relations: ['user', 'replies'],
    });
    if (!post) {
      throw new NotFoundException();
    }

    const transformedPost = {
      ...post,
      user: new UserDto(post.user),
    };

    return transformedPost;
  }

  async modifyPost({
    where,
    data,
    token,
  }: {
    where: { id: number };
    data: ModifyPostDTO;
    token: string;
  }) {
    const { sub } = await this.authService.verifyToken(token);

    const posting = await this.getPost(where);
    if (posting.user_id !== sub) {
      throw new UnauthorizedException('작성자만 수정 가능합니다.');
    }

    await this.postRepository.update(where, data);

    return { success: true };
  }

  async removePost({ where, token }: { where: { id: number }; token: string }) {
    const { sub } = await this.authService.verifyToken(token);

    const posting = await this.getPost(where);
    if (posting.user_id !== sub) {
      throw new UnauthorizedException('작성자만 삭제 가능합니다.');
    }

    await this.postRepository.delete(where);

    return { success: true };
  }

  async getAllRecords() {
    return await this.postRepository.find();
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
