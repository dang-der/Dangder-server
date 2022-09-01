import { Field, ObjectType } from '@nestjs/graphql';
import { Chatroom } from 'src/apis/chatRooms/entities/chatRoom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  sendMessage: string;
  // 보낸 메시지

  @Column()
  @Field(() => String)
  receiveMessage: string;
  // 받은 메시지

  @Column()
  @Field(() => Boolean)
  isRead: boolean;

  @CreateDateColumn()
  chatCreatedAt: Date;

  // 수업 내용 중 payment에서 가져왔다.
  // ENUM은 Boolean이나 0과 1 중 택과 다르게
  // 내가 직접 항목을 만들어서 둘 중 또는 셋 중 선택

  @JoinColumn()
  @Field(() => Chatroom)
  @OneToOne(() => Chatroom)
  chatroom: Chatroom;
  // ChatMessage 1 : Chatroom 1 연결
}
