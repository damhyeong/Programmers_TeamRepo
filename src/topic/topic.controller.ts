import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TopicService } from './topic.service';

@Controller('topics')
@ApiTags('topics')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Get()
  async getManyTopic() {
    return await this.topicService.findManyTopic();
  }
}
