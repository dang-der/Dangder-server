import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Donate } from 'src/apis/donates/entities/donate.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

// export enum CERT_ENUM { // 실제 ENUM은 이거고
//   CERT = 'CERT', // 패스 구매 유저
//   UNCERT = 'UNCERT', // 패스를 구매하지 않은 유저
// }

// registerEnumType(CERT_ENUM, {
//   // 이것은 graphql에 등록하기 위해
//   name: 'CERT_ENUM',
// });

// CERT_ENUM.CERT;

// 혹시 ENUM으로 바꿀까봐 나뒀습니다.

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

  @Column({ default: 0 })
  @Field(() => Int)
  pet: number;

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

  @Column()
  @Field(() => Int)
  reportCnt: number;

  @Column()
  @Field(() => Int)
  donateTotal: number;

  // @Column({ type: 'enum', enum: CERT_ENUM })
  // @Field(() => CERT_ENUM)
  // isCert: string;
  // isCert -> ENUM 전환하려면

  @Column()
  @Field(() => Boolean)
  isCert: boolean;

  // 이 회원이 패스를 구매했는가?

  @Column()
  @Field(() => String)
  donateGrade: string;

  //후원 등급

  @JoinColumn()
  @ManyToOne(() => Donate)
  @Field(() => Donate)
  donate: Donate;
  //후원 Id
  // User N : Donate 1 연결
}
