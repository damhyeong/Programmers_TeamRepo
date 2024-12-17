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
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { Posts } from './posts.entity';
import { ModifyPostDTO } from './dto/modify-post.dto';
import { FindManyPostDTO } from './dto/find-post.dto';
import { ReplyService } from 'src/reply/reply.service';
import { FindManyReplyDTO } from 'src/reply/dto/find-reply.dto';

@ApiTags('posts')
@ApiBearerAuth('access-token')
@Controller('posts')
export class PostsController {
  constructor(
    private postService: PostsService,
    private replyService: ReplyService,
  ) {}

  @Post()
  @ApiBody({ type: CreatePostDTO })
  async postPosts(
    @Headers('authorization') token: string,
    @Body() body: CreatePostDTO,
  ): Promise<Posts> {
    return await this.postService.createPost(
      token.replace('Bearer ', ''),
      body,
    );
  }

  @Get()
  @ApiQuery({ name: 'meeting_id', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  async getManyPosts(@Query() query: FindManyPostDTO) {
    return await this.postService.getManyPost(query);
  }

  @Get(':id')
  async getPosts(@Param('id', ParseIntPipe) id: number) {
    return await this.postService.getPost({ id });
  }

  @Get(':id/reply')
  @ApiQuery({ name: 'page', required: true, type: Number })
  async getManyReply(
    @Param('id', ParseIntPipe) id: number,
    @Query() { page }: FindManyReplyDTO,
  ) {
    return await this.replyService.getManyReply({ post_id: id, page });
  }

  @Put(':id')
  @ApiBody({ type: ModifyPostDTO })
  async putPosts(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModifyPostDTO,
  ) {
    return await this.postService.modifyPost({
      where: { id },
      data: body,
      token: token.replace('Bearer ', ''),
    });
  }

  @Delete(':id')
  async deletePost(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postService.removePost({
      where: { id },
      token: token.replace('Bearer ', ''),
    });
  }
}
