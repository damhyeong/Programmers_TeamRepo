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
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';
import { MeetingDTO } from './dto/create-meeting.dto';
import { FindManyMeetingDTO } from './dto/find-meeting.dto';
import { MeetingUsersService } from 'src/meeting-users/meeting-users.service';
import { DeleteMeetingUserDTO } from 'src/meeting-users/dto/delete-meeting-users.dto';
import { AuthService } from "../auth/auth.service";

@ApiTags('meeting')
@ApiBearerAuth('access-token')
@Controller('meeting')
export class MeetingController {
  constructor(
    private meetingService: MeetingService,
    private meetingUserService: MeetingUsersService,
    private authService : AuthService
  ) {}

  @Post()
  @ApiBody({ type: MeetingDTO })
  async postMeeting(
    @Headers('authorization') token: string,
    @Body() body: MeetingDTO,
  ): Promise<Meeting> {
    return await this.meetingService.createMeeting(
      token,
      body,
    );
  }

  // replaceToken 이 string | null 인데, 이상하게 내부 서비스 모듈에서 조건문을 통과하면서 jwt must be string 에러가 나고 있어서 고쳤습니다.
  @Post(':id/participation')
  async postMeetingParticipation(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const replaceToken = token.replace('Bearer ', '');

    const {sub} = await this.authService.replaceAndVerify(token);

    await this.meetingService.findMeeting({ id }, replaceToken);

    return await this.meetingUserService.createMeetingUser(sub, {
      meeting_id: id,
      role: 'member',
    });
  }

  @Get()
  @ApiQuery({ name: 'topic_id', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'per_page', required: true, type: Number })
  @ApiQuery({ name: 'availableOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'ongoingOnly', required: false, type: Boolean })
  async getManyMeeting(@Query() query: FindManyMeetingDTO) {
    return await this.meetingService.findManyMeeting(query);
  }

  @Get(':id')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token (optional)',
    required: false,
  })
  async getMeeting(
    @Headers('authorization') token: string | undefined,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const formattedToken = token?.replace('Bearer ', '') || null;

    return await this.meetingService.findMeeting({ id }, formattedToken);
  }

  @Put(':id')
  async putMeeting(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MeetingDTO,
  ) {
    return await this.meetingService.modifyMeeting({
      token: token.replace('Bearer ', ''),
      where: { id },
      data: body,
    });
  }

  @Delete(':id')
  async deleteMeeting(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.meetingService.removeMeeting({
      token: token.replace('Bearer ', ''),
      where: { id },
    });
  }

  @Delete(':id/users')
  @ApiBody({ type: DeleteMeetingUserDTO })
  async deleteMeetingUser(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() { user_id }: { user_id: number },
  ) {
    return await this.meetingUserService.removeMeetingUser({
      user_id,
      meeting_id: id,
      token: token.replace('Bearer ', ''),
    });
  }
}
