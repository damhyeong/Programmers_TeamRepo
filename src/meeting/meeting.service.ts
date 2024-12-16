import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findManyMeeting(where?: { topic_id?: number }) {
    const query = where?.topic_id ? { topic_id: where.topic_id } : undefined;

    return await this.meetingRepository.find({
      where: query,
      order: { id: 'ASC' },
      relations: ['posts'],
    });
  }

  async findMeeting(where: { id: number }) {
    const meeting = await this.meetingRepository.findOne({ where });
    if (!meeting) {
      throw new NotFoundException();
    }

    return meeting;
  }

  // 방장인지 확인해야 됨
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

  // 방장인지 확인
  async removeMeeting(where: { id: number }) {
    await this.findMeeting(where);
    await this.meetingRepository.delete(where);

    return { success: true };
  }
}
