import { MeetingUsers } from 'src/meeting-users/meeting-users.entity';
import { Meeting } from 'src/meeting/meeting.entity';
import { Posts } from 'src/posts/posts.entity';
import { Reply } from 'src/reply/reply.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  gender: string;

  @Column()
  birth_date: Date;

  @Column()
  password: string;

  @Column({
    type: 'text',
  })
  profile_img: string;

  @Column({
    type: 'text',
  })
  introduction: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Meeting, (meeting) => meeting.user)
  meetings: Meeting[];

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @OneToMany(() => MeetingUsers, (meeting_users) => meeting_users.user)
  meeting_users: MeetingUsers[];
}
