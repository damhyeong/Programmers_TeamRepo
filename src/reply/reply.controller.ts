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
import { ReplyService } from './reply.service';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { Reply } from './reply.entity';
import { ModifyReplyDTO } from './dto/modify-reply.dto';

@ApiTags('replies')
@Controller('replies')
export class ReplyController {
  constructor(private replyService: ReplyService) {}

  @Post()
  @ApiBody({ type: CreateReplyDTO })
  async postReply(@Body() body: CreateReplyDTO): Promise<Reply> {
    return await this.replyService.createReply(body);
  }

  @Get()
  @ApiQuery({
    name: 'post_id',
    type: Number,
    required: false,
  })
  async getManyReply(@Query() post_id: number) {
    return await this.replyService.getManyReply({ post_id });
  }

  @Put(':id')
  async putReply(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModifyReplyDTO,
    user_id: number,
  ) {
    return await this.replyService.modifyReply({
      where: { id },
      data: body,
      user_id,
    });
  }

  @Delete(':id')
  async deleteReply(@Param('id', ParseIntPipe) id: number, user_id: number) {
    return await this.replyService.removeReply({ where: { id }, user_id });
  }
}
