import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PAYMENT_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(PAYMENT_STATUS_ENUM, {
  // 이것은 graphql에 등록하기 위해
  name: 'PAYMENT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // import Uid
  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  payMoney: number;

  @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
  @Field(() => PAYMENT_STATUS_ENUM)
  paymentType: string;

  @JoinColumn()
  @Field(() => User)
  @ManyToOne(() => User)
  user: User;

  // 생성된 시간 추가

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
