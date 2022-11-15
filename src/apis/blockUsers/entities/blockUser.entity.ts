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
  email: string;

  // 차단 대상 유저 id
  @Column()
  @Field(() => String)
  blockId: string;

  // BlockUser N : User 1 연결

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.blockUsers, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;
}
