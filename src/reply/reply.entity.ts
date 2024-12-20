import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../users/entity/users.entity";
import { ReplyLikes } from "../reply-likes/reply-likes.entity";
import { Posts } from "../posts/posts.entity";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  @Index() // reply_id에 인덱스 추가
  reply_id?: number;

  @Column({ default: true })
  is_show: boolean;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  // 작성자
  @ManyToOne(() => Users, (user) => user.replies, {
    nullable: true,
    onDelete: 'SET NULL', // 작성자 삭제 시 user_id를 NULL로 설정
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  // 게시글
  @ManyToOne(() => Posts, (post) => post.replies, {
    nullable: false,
    onDelete: 'CASCADE', // 게시글 삭제 시 댓글도 삭제
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  // 부모 댓글
  @ManyToOne(() => Reply, (reply) => reply.childReplies, {
    nullable: true, // 루트 댓글 허용
    onDelete: 'SET NULL', // 부모 댓글이 삭제되면 reply_id를 NULL로 설정
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reply_id' })
  reply: Reply | null;

  // 자식 댓글
  @OneToMany(() => Reply, (reply) => reply.reply)
  childReplies: Reply[];

  @OneToMany(() => ReplyLikes, (replyLikes) => replyLikes.reply)
  reply_likes: ReplyLikes[];
}
