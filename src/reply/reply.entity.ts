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
  user_id: number | null; // 유저 삭제 시를 대비한 null

  @Column({ nullable: true })
  reply_id?: number;

  @Column({ default: true })
  is_show: boolean;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.replies, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users | null; // 유저는 삭제되어 정보가 없을수도 있으므로,

  @ManyToOne(() => Posts, (post) => post.replies, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  // 해당 코드는 부모 댓글의 PK 를 다시 참조하며, 삭제가 불가능하도록 만들었습니다. - 하위 댓글 보호
  @ManyToOne(() => Reply, (reply) => reply.childReplies, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reply_id' })
  reply: Reply | null;

  @OneToMany(() => Reply, (reply) => reply.reply)
  childReplies : Reply[];

  @OneToMany(() => ReplyLikes, (replyLikes) => replyLikes.reply)
  reply_likes: ReplyLikes[];
}
