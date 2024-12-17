import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MeetingUsers } from './meeting-users.entity';
import { MeetingUserDTO } from './dto/create-meeting-users.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MeetingUsersService {
  constructor(
    @InjectRepository(MeetingUsers)
    private meetingRepository: Repository<MeetingUsers>,
  ) {}

  async createMeetingUser(user_id: number, data: MeetingUserDTO) {
    const meetingUser = this.meetingRepository.create({
      user_id,
      ...data,
    });
    await this.meetingRepository.save(meetingUser);

    return meetingUser;
  }
}
