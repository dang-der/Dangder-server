import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { PAYMENT_TYPE_ENUM } from 'src/commons/type/enums';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

registerEnumType(PAYMENT_TYPE_ENUM, {
  // 이것은 graphql에 등록하기 위해
  name: 'PAYMENT_TYPE_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Int)
  payMoney: number;

  @Column({ type: 'enum', enum: PAYMENT_TYPE_ENUM })
  @Field(() => PAYMENT_TYPE_ENUM)
  paymentType: string;

  @JoinColumn()
  @Field(() => User)
  @OneToOne(() => User)
  user: User;
}
