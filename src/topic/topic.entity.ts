import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
