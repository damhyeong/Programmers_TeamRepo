import { Column, CreateDateColumn, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  email : string;

  @Column()
  username : string;

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