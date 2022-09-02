import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class Donate {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
  //후원 Id
  // User 1 : Donate N 연결
}
