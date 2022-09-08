import { Field, ObjectType } from '@nestjs/graphql';
import { ChatRoom } from 'src/apis/chatRooms/entities/chatRoom.entity';
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

  // 보낸 유저의 id
  @Column()
  @Field(() => String)
  senderId: string;

  // 보낸 메시지
  @Column()
  @Field(() => String)
  sendMessage: string;

  // 읽음 안 읽음
  @Column({ default: false })
  @Field(() => Boolean)
  isRead: boolean;

  @CreateDateColumn()
  chatCreatedAt: Date;

  // 수업 내용 중 payment에서 가져왔다.
  // ENUM은 Boolean이나 0과 1 중 택과 다르게
  // 내가 직접 항목을 만들어서 둘 중 또는 셋 중 선택

  @JoinColumn()
  @Field(() => ChatRoom)
  @OneToOne(() => ChatRoom)
  chatRoom: ChatRoom;
  // ChatMessage 1 : Chatroom 1 연결
}
