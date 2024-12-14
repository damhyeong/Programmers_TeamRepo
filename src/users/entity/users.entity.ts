import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class UsersEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  email : string;

  @Column()
  gender : string;

  @Column()
  birth_date : Date;

  @Column()
  password : string;

  @Column({
    type : "text"
  })
  profile_img : string

  @Column({
    type : "text"
  })
  introduction : string

  @CreateDateColumn()
  created_at : Date
}