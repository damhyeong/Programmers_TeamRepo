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
    return await this.topicRepository.find({ order: { id: 'ASC' } });
  }

  async findTopic(where : {id : number}) {
    return await this.topicRepository.findOne({where});
  }

  async allRecords() {
    return await this.topicRepository.find();
  }
}
