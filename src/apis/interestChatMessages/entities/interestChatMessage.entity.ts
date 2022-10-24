import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InterestChatRoom } from 'src/apis/interestChatRooms/entities/interestChatRoom.entity';
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
export class InterestChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 메시지를 보낸 유저의 id
  @Column()
  @Field(() => String)
  senderId: string;

  // 메시지 형식 (메시지, 좌표값, 약속시간)
  @Column()
  @Field(() => String)
  type: string;

  // 보낸 메시지
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  message: string;

  @Column({ type: 'double', nullable: true })
  @Field(() => Float, { nullable: true })
  lat: number;

  @Column({ type: 'double', nullable: true })
  @Field(() => Float, { nullable: true })
  lng: number;

  // 약속시간
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  meetAt: string;

  // 메시지 Read 여부 - 향후 개발
  // @Column({ default: false })
  // @Field(() => Boolean)
  // isRead: boolean;

  @CreateDateColumn()
  chatCreatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // InterestChatMessage : InterestChatroom - N:1 연결
  @JoinColumn()
  @Field(() => InterestChatRoom)
  @ManyToOne(() => InterestChatRoom, { onDelete: 'CASCADE' })
  interestChatRoom: InterestChatRoom;
}
