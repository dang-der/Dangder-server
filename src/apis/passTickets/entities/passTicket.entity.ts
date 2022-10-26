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

  @Column({ default: 0 })
  @Field(() => String)
  expiredAt: string;

  @JoinColumn()
  @ManyToOne(() => User, (user) => user.passTickets)
  @Field(() => User)
  user: User;
}
