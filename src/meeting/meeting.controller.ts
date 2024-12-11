import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MeetingService } from './meeting.service';
import { Meeting } from './meeting.entity';
import { MeetingDTO } from './dto/create-meeting.dto';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post()
  @ApiBody({ type: MeetingDTO })
  async postMeeting(@Body() body: MeetingDTO): Promise<Meeting> {
    return await this.meetingService.createMeeting(body);
  }

  @Get()
  async getManyMeeting() {
    return await this.meetingService.findManyMeeting();
  }

  @Get(':id')
  async getMeeting(@Param('id', ParseIntPipe) id: number) {
    return await this.meetingService.findMeeting({ id });
  }

  @Put(':id')
  async putMeeting(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MeetingDTO,
  ) {
    return await this.meetingService.modifyMeeting({
      where: { id },
      data: body,
    });
  }

  @Delete(':id')
  async deleteMeeting(@Param('id', ParseIntPipe) id: number) {
    return await this.meetingService.removeMeeting({ id });
  }
}
