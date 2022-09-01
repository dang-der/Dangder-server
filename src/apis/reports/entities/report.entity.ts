import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reportId: string;

  @Column()
  @Field(() => String)
  reportContent: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
  // ReportBoard N : User 1 연결
}
