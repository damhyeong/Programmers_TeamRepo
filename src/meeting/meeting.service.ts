import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingDTO } from './dto/create-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
  ) {}

  async createMeeting(data: MeetingDTO): Promise<Meeting> {
    const meeting = this.meetingRepository.create(data);

    return await this.meetingRepository.save(meeting);
  }

  async findManyMeeting() {
    return await this.meetingRepository.find();
  }

  async findMeeting(where: { id: number }) {
    const meeting = await this.meetingRepository.findOne({ where });
    if (!meeting) {
      return { success: false };
    }

    return meeting;
  }

  async modifyMeeting({
    where,
    data,
  }: {
    where: { id: number };
    data: MeetingDTO;
  }) {
    await this.findMeeting(where);
    await this.meetingRepository.update(where, data);

    return { success: true };
  }

  async removeMeeting(where: { id: number }) {
    await this.findMeeting(where);
    await this.meetingRepository.delete(where);

    return { success: true };
  }
}
