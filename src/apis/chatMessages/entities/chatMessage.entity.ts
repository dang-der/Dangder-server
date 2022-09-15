import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ChatRoom } from 'src/apis/chatRooms/entities/chatRoom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 메시지를 보낸 유저의 id
  @Column()
  @Field(() => String)
  senderId: string;

  // 보낸 메시지
  @Column()
  @Field(() => String, { nullable: true })
  msg: string;

  @Column({ type: 'double' })
  @Field(() => Float, { nullable: true })
  lat: number;

  @Column({ type: 'double' })
  @Field(() => Float, { nullable: true })
  lng: number;

  // 약속시간
  @Column()
  @Field(() => Date, { nullable: true })
  meetAt: Date;

  // 메시지 Read 여부 - 향후 개발
  // @Column({ default: false })
  // @Field(() => Boolean)
  // isRead: boolean;

  @CreateDateColumn()
  chatCreatedAt: Date;

  // ChatMessage : Chatroom - N:1 연결
  @JoinColumn()
  @Field(() => ChatRoom)
  @ManyToOne(() => ChatRoom)
  chatRoom: ChatRoom;
}
