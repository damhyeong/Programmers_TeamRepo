import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtMiddleware } from '../common/middleware/jwt.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 테스팅 라우트 컨트롤러 작성 후, 여기서 이어가기.
    consumer
      .apply(JwtMiddleware)
      .exclude(
        {
          path: 'email-check',
          method: RequestMethod.POST,
        },
        {
          path: 'signup',
          method: RequestMethod.POST,
        },
        {
          path: 'login',
          method: RequestMethod.POST,
        },
      )
      .forRoutes(UsersController);
  }
}
