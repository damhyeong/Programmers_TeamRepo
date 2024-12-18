import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Topic } from 'src/topic/topic.entity';
import { Posts } from 'src/posts/posts.entity';
import { Users } from 'src/users/entity/users.entity';
import { MeetingUsers } from 'src/meeting-users/meeting-users.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  topic_id: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  max_members: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  gender_condition: string;

  @Column()
  age_condition: string;

  @Column()
  owner_user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Topic, (topic) => topic.id, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @OneToMany(() => Posts, (post) => post.meeting)
  posts: Posts[];

  @ManyToOne(() => Users, (user) => user.meetings, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'owner_user_id' })
  user: Users;

  @OneToMany(() => MeetingUsers, (meeting_users) => meeting_users.meeting)
  meeting_users: MeetingUsers[];
}
