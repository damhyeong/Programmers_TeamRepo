import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { Posts } from './posts.entity';
import { ModifyPostDTO } from './dto/modify-post.dto';
import { FindManyPostDTO } from './dto/find-post.dto';

// 토큰 적용 X 게시글 삭제, 수정 시 작성자인지 확인 해야 됨
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post()
  @ApiBody({ type: CreatePostDTO })
  async postPosts(@Body() body: CreatePostDTO): Promise<Posts> {
    return await this.postService.createPost(body);
  }

  @Get()
  @ApiQuery({ type: FindManyPostDTO })
  async getManyPosts(@Query() query: FindManyPostDTO) {
    return await this.postService.getManyPost(query);
  }

  @Get(':id')
  async getPosts(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.getPost({ id });
  }

  @Put(':id')
  @ApiBody({ type: ModifyPostDTO })
  async putPosts(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModifyPostDTO,
    user_id: number,
  ) {
    return await this.postService.modifyPost({
      where: { id },
      data: body,
      user_id,
    });
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number, user_id: number) {
    return await this.postService.removePost({ where: { id }, user_id });
  }
}
