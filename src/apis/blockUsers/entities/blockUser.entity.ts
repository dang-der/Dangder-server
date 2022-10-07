import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class BlockUser {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  blockId: string;
  // 차단 대상 유저 id

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
  // BlockUser N : User 1 연결
}
