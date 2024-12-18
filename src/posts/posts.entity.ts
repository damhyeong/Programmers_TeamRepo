import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Meeting } from 'src/meeting/meeting.entity';
import { Reply } from 'src/reply/reply.entity';
import { Users } from 'src/users/entity/users.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meeting_id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  img: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Meeting, (meeting) => meeting.posts, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @ManyToOne(() => Users, (user) => user.posts, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Reply, (reply) => reply.post)
  replies: Reply[];
}
