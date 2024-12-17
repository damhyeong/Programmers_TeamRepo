import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Users } from 'src/users/entity/users.entity';
import { Meeting } from 'src/meeting/meeting.entity';

@Entity()
export class MeetingUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meeting_id: number;

  @Column()
  user_id: number;

  @Column({ default: 'member' })
  role: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Meeting, (meeting) => meeting.meeting_users)
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @ManyToOne(() => Users, (user) => user.meeting_users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
