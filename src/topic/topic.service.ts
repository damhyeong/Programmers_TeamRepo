import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic) private topicRepository: Repository<Topic>,
  ) {}

  async findManyTopic() {
    return await this.topicRepository.find();
  }
}
