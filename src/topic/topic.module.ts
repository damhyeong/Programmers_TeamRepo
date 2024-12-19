import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { JwtMiddleware } from '../common/middleware/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TypeOrmModule, TopicService],
})
export class TopicModule implements NestModule {}
