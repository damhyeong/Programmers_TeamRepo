import {
  forwardRef, HttpException, HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import {
  FindOptionsWhere,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Meeting } from './meeting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingDTO } from './dto/create-meeting.dto';
import { AuthService } from 'src/auth/auth.service';
import { MeetingUsersService } from 'src/meeting-users/meeting-users.service';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => MeetingUsersService))
    private meetingUserService: MeetingUsersService,
  ) {}

  async createMeeting(token: string, data: MeetingDTO): Promise<Meeting> {
    const {sub} = await this.authService.replaceAndVerify(token);


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
 // where (query) 자체는 page, per_page 속성으로 인해, null 이 되지 않으므로 ? 를 없앴습니다.
  async findManyMeeting(where: {
    topic_id?: number;
    page: number;
    keyword?: string;
    per_page: number;
    availableOnly?: boolean;
    ongoingOnly?: boolean;
  }) {
    const SKIP = (where.page - 1) * where.per_page;

    const conditions: FindOptionsWhere<any> = {};

    // 주제 ID 필터링
    if (where?.topic_id) {
      conditions.topic_id = where.topic_id;
    }

    // keyword 필터링
    if (where?.keyword) {
      conditions.title = Like(`%${where.keyword}%`);
      conditions.description = Like(`%${where.keyword}%`);
    }

    // 진행 중인 미팅 필터링
    if (where?.ongoingOnly) {
      const today = new Date();

      conditions.start_date = LessThanOrEqual(today);
      conditions.end_date = MoreThanOrEqual(today);
    }

    const [data, total] = await this.meetingRepository.findAndCount({
      where: conditions,
      take: where.per_page,
      skip: SKIP,
      order: { created_at: 'DESC' },
      relations: ['posts', 'topic'],
    });

    // 각 미팅에 대해 활성 사용자 수를 계산하여 필터링
    const meetingsWithActiveUserCount = [];
    for (const meeting of data) {
      const activeUserCount = await this.meetingUserService.countActiveUsers(
        meeting.id,
      );
      if (meeting.max_members > activeUserCount) {
        meetingsWithActiveUserCount.push({
          ...meeting,
        });
      }
    }

    return {
      meeting: meetingsWithActiveUserCount,
      total,
      currentPage: where.page,
      totalPages: Math.ceil(total / where.per_page),
    };
  }

  // 이 라우트는 JWT 미들웨어를 거치지 않음 - jwt token 을 가지고 오는 경우, 그건 다른 메서드에서 부른 것.
  async findMeeting(where: { id: number }, token?: string) {
    let sub: number | null = null;

    if (token) {

      try{
        const payload = await this.authService.verifyToken(token);

        sub = payload?.sub || null;
      } catch (error) {
        throw new HttpException(
          {
            message : "다른 컨트롤러에서 다루다가 jwt 잘못 넘길 경우 생기는 에러"
          },
          HttpStatus.UNAUTHORIZED
        )
      }
    }

    const meeting = await this.meetingRepository.findOne({
      where,
      relations: ['topic', 'meeting_users', 'meeting_users.user'],
    });
    if (!meeting) {
      throw new NotFoundException();
    }

    const participation = meeting.meeting_users.some(
      (meetingUser) => meetingUser.user_id === sub,
    );

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
      participation,
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
