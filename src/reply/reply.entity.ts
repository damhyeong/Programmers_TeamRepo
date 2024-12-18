import { Posts } from 'src/posts/posts.entity';
import { ReplyLikes } from 'src/reply-likes/reply-likes.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  reply_id?: number;

  @Column({ default: true })
  is_show: boolean;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.replies, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Posts, (post) => post.replies, {
    nullable: false,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @ManyToOne(() => Reply, (reply) => reply.reply, {
    nullable: true,
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'reply_id' })
  reply: Reply;

  @OneToMany(() => ReplyLikes, (replyLikes) => replyLikes.reply)
  reply_likes: ReplyLikes[];
}
