import { Field, ObjectType } from '@nestjs/graphql';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // 채팅 상대 강아지의 id
  @Column()
  @Field(() => String)
  chatPairId: string;

  // Chatroom : Dog - N:1 연결
  @JoinColumn()
  @ManyToOne(() => Dog)
  @Field(() => Dog)
  dog: Dog;

  // ChatRoom : ChatMessage - 1:N 연결
  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chatRoom)
  @Field(() => [ChatMessage])
  chatMessages: ChatMessage[];

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
