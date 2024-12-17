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
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';
import { MeetingDTO } from './dto/create-meeting.dto';
import { FindManyMeetingDTO } from './dto/find-meeting.dto';
import { MeetingUsersService } from 'src/meeting-users/meeting-users.service';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('meeting')
@ApiBearerAuth('access-token')
@Controller('meeting')
export class MeetingController {
  constructor(
    private meetingService: MeetingService,
    private meetingUserService: MeetingUsersService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiBody({ type: MeetingDTO })
  async postMeeting(
    @Headers('authorization') token: string,
    @Body() body: MeetingDTO,
  ): Promise<Meeting> {
    return await this.meetingService.createMeeting(
      token.replace('Bearer ', ''),
      body,
    );
  }

  @Post(':id/participation')
  async postMeetingParticipation(
    @Headers('authorization') token: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { sub } = await this.authService.verifyToken(
      token.replace('Bearer ', ''),
    );

    await this.meetingService.findMeeting({ id });

    return await this.meetingUserService.createMeetingUser(sub, {
      meeting_id: id,
      role: 'member',
    });
  }

  @Get()
  @ApiQuery({ name: 'topic_id', required: false, type: Number })
  @ApiQuery({ name: 'page', required: true, type: Number })
  async getManyMeeting(@Query() query: FindManyMeetingDTO) {
    return await this.meetingService.findManyMeeting(query);
  }

  @Get(':id')
  async getMeeting(@Param('id', ParseIntPipe) id: number) {
    return await this.meetingService.findMeeting({ id });
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
}
