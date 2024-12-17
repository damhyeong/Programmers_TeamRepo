import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingDTO } from './dto/create-meeting.dto';
import { AuthService } from 'src/auth/auth.service';
import { LIMIT } from 'src/common/constant/page';
import { MeetingUsersService } from 'src/meeting-users/meeting-users.service';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    private readonly authService: AuthService,
    private meetingUserService: MeetingUsersService,
  ) {}

  async createMeeting(token: string, data: MeetingDTO): Promise<Meeting> {
    const { sub } = await this.authService.verifyToken(token);

    const meeting = this.meetingRepository.create({
      owner_user_id: sub,
      ...data,
    });
    const savedMeeting = await this.meetingRepository.save(meeting);

    await this.meetingUserService.createMeetingUser(sub, {
      meeting_id: savedMeeting.id,
      role: 'master',
    });

    return savedMeeting;
  }

  async findManyMeeting(where?: {
    topic_id?: number;
    page: number;
    keyword?: string;
  }) {
    const SKIP = (where.page - 1) * LIMIT;

    const query: any = {};
    if (where?.topic_id) {
      query.topic_id = where.topic_id;
    }

    const conditions: any[] = [];
    if (where?.keyword) {
      conditions.push(
        { title: Like(`%${where.keyword}%`) },
        { description: Like(`%${where.keyword}%`) },
      );
    }

    const [data, total] = await this.meetingRepository.findAndCount({
      where: conditions.length ? conditions : query,
      take: LIMIT,
      skip: SKIP,
      order: { created_at: 'DESC' },
      relations: ['posts'],
    });

    return {
      meeting: data,
      total,
      currentPage: where.page,
      totalPages: Math.ceil(total / LIMIT),
    };
  }

  async findMeeting(where: { id: number }) {
    const meeting = await this.meetingRepository.findOne({
      where,
      relations: ['meeting_users', 'meeting_users.user'],
    });
    if (!meeting) {
      throw new NotFoundException();
    }

    const meetingUsersWithUserDTO = meeting.meeting_users.map((meetingUser) => {
      const { password, ...userWithoutPassword } = meetingUser.user;
      return {
        ...meetingUser,
        user: userWithoutPassword,
      };
    });

    return {
      ...meeting,
      meeting_users: meetingUsersWithUserDTO,
    };
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
