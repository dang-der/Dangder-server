import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column()
  @Field(() => Boolean)
  pet: boolean;

  // 반려동물여부

  @Column({ default: 0 })
  @Field(() => Int)
  ddMoney: number;

  @Column()
  @Field(() => String)
  phone: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: 0 })
  @Field(() => Int)
  reportCnt: number;

  @Column({ default: 0 })
  @Field(() => Int)
  donateTotal: number;

  // @Column({ type: 'enum', enum: CERT_ENUM })
  // @Field(() => CERT_ENUM)
  // isCert: string;
  // isCert -> ENUM 전환하려면

  @Column({ default: false })
  @Field(() => Boolean)
  isCert: boolean;

  // 이 회원이 패스를 구매했는가?

  @Column({ default: '일반회원' })
  @Field(() => String)
  donateGrade: string;

  //후원 등급
}
