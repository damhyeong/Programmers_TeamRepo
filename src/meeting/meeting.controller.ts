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

@ApiTags('meeting')
@ApiBearerAuth('access-token')
@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

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

  @Get()
  @ApiQuery({ type: FindManyMeetingDTO })
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
