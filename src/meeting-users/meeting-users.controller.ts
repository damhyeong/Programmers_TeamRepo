import { Controller, Get } from "@nestjs/common";
import { MeetingUsersService } from "./meeting-users.service";

@Controller('meeting-users')
export class MeetingUsersController {
  constructor(private meetingUsersService : MeetingUsersService) {}

  @Get('database')
  async getAllRecords(){
    return await this.meetingUsersService.getAllRecords();
  }
}