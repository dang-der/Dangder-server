import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlockUser } from 'src/apis/blockUsers/entities/blockUser.entity';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { PassTicket } from 'src/apis/passTickets/entities/passTicket.entity';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { Report } from 'src/apis/reports/entities/report.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
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
  password: string;

  @Column({ default: false })
  @Field(() => Boolean)
  pet: boolean;

  // 반려동물여부

  @Column({ default: 0 })
  @Field(() => Int)
  ddMoney: number;

  @Column({ nullable: true })
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

  // 이 회원이 패스를 구매했는가?

  @Column({ default: false })
  @Field(() => Boolean)
  isCert: boolean;

  //후원 등급
  @Column({ default: '일반회원' })
  @Field(() => String)
  donateGrade: string;

  //정지 여부
  @Column({ default: false })
  @Field(() => Boolean)
  isStop: boolean;

  @Field(() => Dog)
  @OneToOne(() => Dog, (dog) => dog.user)
  dog: Dog;

  @OneToMany(() => Payment, (payment) => payment.id)
  @Field(() => Payment)
  payment: Payment;

  @OneToMany(() => PassTicket, (passTicket) => passTicket.id)
  @Field(() => PassTicket)
  passTicket: PassTicket;

  @OneToMany(() => BlockUser, (blockUser) => blockUser.blockId, {
    cascade: true,
  })
  @Field(() => [BlockUser])
  userId: BlockUser[];

  @OneToMany(() => Report, (report) => report.id)
  @Field(() => Report)
  reportId: Report;
}
