import { Posts } from 'src/posts/posts.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
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

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  //   @ManyToOne(() => User, (user) => user.id)
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;

  @ManyToOne(() => Posts, (post) => post.replies)
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @ManyToOne(() => Reply, (reply) => reply.reply)
  @JoinColumn({ name: 'reply_id' })
  reply: Reply;
}
