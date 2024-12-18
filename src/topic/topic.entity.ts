import { Meeting } from 'src/meeting/meeting.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Meeting, (meeting) => meeting.topic)
  meeting: Meeting[];
}
