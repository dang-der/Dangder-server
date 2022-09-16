import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chatMessage.entity';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  // chatRoomId로 찾는다.
  findAllByChatRoomId({ chatRoomId }) {
    return this.chatMessagesRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: { chatRoom: true },
    });
  }

  // senderId, message로 채팅메시지 생성
  create({ chatRoomId, chatMessageInput }) {
    return this.chatMessagesRepository.save({
      chatRoom: { id: chatRoomId },
      ...chatMessageInput,
    });
  }
}
