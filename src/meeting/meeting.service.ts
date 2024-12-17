import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingDTO } from './dto/create-meeting.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    private readonly authService: AuthService,
  ) {}

  async createMeeting(token: string, data: MeetingDTO): Promise<Meeting> {
    const { sub } = await this.authService.verifyToken(token);

    const meeting = this.meetingRepository.create({
      owner_user_id: sub,
      ...data,
    });

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

  async modifyMeeting({
    token,
    where,
    data,
  }: {
    token: string;
    where: { id: number };
    data: MeetingDTO;
  }) {
    const { sub } = await this.authService.verifyToken(token);

    const meeting = await this.findMeeting(where);
    if (meeting.owner_user_id !== sub) {
      throw new UnauthorizedException('방장만 수정 가능합니다.');
    }

    await this.meetingRepository.update(where, data);

    return { success: true };
  }

  // 방장인지 확인
  async removeMeeting({
    token,
    where,
  }: {
    token: string;
    where: { id: number };
  }) {
    const { sub } = await this.authService.verifyToken(token);

    const meeting = await this.findMeeting(where);
    if (meeting.owner_user_id !== sub) {
      throw new UnauthorizedException('방장만 삭제 가능합니다.');
    }

    await this.meetingRepository.delete(where);

    return { success: true };
  }
}
