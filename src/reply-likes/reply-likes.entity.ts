import { Reply } from 'src/reply/reply.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class ReplyLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  reply_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.reply_likes, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Reply, (reply) => reply.reply_likes, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'reply_id' })
  reply: Reply;
}
