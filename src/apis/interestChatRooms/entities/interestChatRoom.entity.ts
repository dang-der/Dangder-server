import { Field, ObjectType } from '@nestjs/graphql';
import { InterestChatMessage } from 'src/apis/interestChatMessages/entities/interestChatMessage.entity';
import { Interest } from 'src/apis/interests/entities/interest.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class InterestChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // InterestChatRoom : Interest - 1:1 연결
  @JoinColumn()
  @OneToOne(() => Interest, (interest) => interest.iChatRoom)
  @Field(() => Interest)
  interest: Interest;

  // InterestChatRoom : InterestChatMessage - 1:N 연결
  @OneToMany(
    () => InterestChatMessage,
    (interestChatMessage) => interestChatMessage.interestChatRoom,
    { cascade: true },
  )
  @Field(() => [InterestChatMessage])
  interestChatMessages: InterestChatMessage[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
