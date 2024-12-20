import { Controller, Get } from "@nestjs/common";
import { ReplyLikesService } from "./reply-likes.service";

@Controller('reply-likes')
export class ReplyLikesController {
  constructor(private replyLikesService : ReplyLikesService) {}

  @Get('/database')
  async getAllRecords() {
    return await this.replyLikesService.getAllRecords();
  }
}