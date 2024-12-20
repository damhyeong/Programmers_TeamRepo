import {
  Body,
  Controller,
  Delete, Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ReplyService } from './reply.service';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { Reply } from './reply.entity';
import { ModifyReplyDTO } from './dto/modify-reply.dto';
import { ReplyLikesService } from 'src/reply-likes/reply-likes.service';

@ApiTags('replies')
@ApiBearerAuth('access-token')
@Controller('replies')
export class ReplyController {
  constructor(
    private replyService: ReplyService,
    private replyLikeService: ReplyLikesService,
  ) {}

  @Post()
  @ApiBody({ type: CreateReplyDTO })
  async postReply(
    @Headers('authorization') token: string,
    @Body() body: CreateReplyDTO,
  ): Promise<Reply> {
    return await this.replyService.createReply(
      token.replace('Bearer ', ''),
      body,
    );
  }

  @Put(':id')
  async putReply(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModifyReplyDTO,
  ) {
    return await this.replyService.modifyReply({
      where: { id },
      data: body,
      token: token.replace('Bearer ', ''),
    });
  }

  @Delete(':id')
  async deleteReply(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.replyService.removeReply({
      where: { id },
      token: token.replace('Bearer ', ''),
    });
  }

  @Post(':id/like')
  async postReplyLike(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.replyLikeService.createReplyLike(
      token.replace('Bearer ', ''),
      id,
    );
  }

  @Delete(':id/like')
  async deleteReplyLike(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.replyLikeService.createReplyLike(
      token.replace('Bearer ', ''),
      id,
    );
  }

  @Get('database')
  async getAllRecords(){
    return await this.replyService.getAllRecords();
  }
}
