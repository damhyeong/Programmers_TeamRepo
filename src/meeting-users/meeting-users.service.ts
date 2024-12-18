import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MeetingUsers } from './meeting-users.entity';
import { MeetingUserDTO } from './dto/create-meeting-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MeetingUsersService {
  constructor(
    @InjectRepository(MeetingUsers)
    private meetingRepository: Repository<MeetingUsers>,
    private readonly authService: AuthService,
  ) {}

  async createMeetingUser(token: string, data: MeetingUserDTO) {
    const { sub } = await this.authService.verifyToken(token);

    const meetingUser = this.meetingRepository.create({
      user_id: sub,
      ...data,
    });
    await this.meetingRepository.save(meetingUser);

    return meetingUser;
  }

  async fetchMeetingUser(where: { user_id: number; meeting_id: number }) {
    const meetingUser = await this.meetingRepository.findOne({ where });
    if (!meetingUser) {
      throw new NotFoundException();
    }

    return meetingUser;
  }

  async removeMeetingUser({
    user_id,
    meeting_id,
    token,
  }: {
    user_id: number;
    meeting_id: number;
    token: string;
  }) {
    const { sub } = await this.authService.verifyToken(token);

    const meetingMaster = await this.fetchMeetingUser({
      user_id: sub,
      meeting_id,
    });
    if (meetingMaster.role !== 'master') {
      throw new UnauthorizedException('방장만 퇴출 시킬 수 있습니다.');
    }

    const meetingUser = await this.fetchMeetingUser({
      user_id: user_id,
      meeting_id,
    });

    if (meetingUser.is_active === false) {
      throw new NotFoundException('해당 사용자는 이미 퇴출된 상태입니다.');
    }

    if (meetingUser.role === 'master') {
      throw new UnauthorizedException('방장 자체는 퇴출할 수 없습니다.');
    }

    await this.meetingRepository.update(
      { user_id, meeting_id, is_active: true },
      { is_active: false },
    );

    return { success: true };
  }
}
