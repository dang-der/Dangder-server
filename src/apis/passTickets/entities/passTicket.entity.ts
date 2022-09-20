import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class PassTicket {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  // 캐시에서 가져와서 숫자를 변환한다. set 되는 순간 getToday + 30
  @Column({ default: '0' })
  @Field(() => String)
  expiredAt: string;

  @JoinColumn()
  @Field(() => User)
  @ManyToOne(() => User)
  user: User;
}
