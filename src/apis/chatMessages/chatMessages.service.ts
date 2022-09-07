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

  // senderId로 찾는다.

  findAllBySenderId({ senderId }) {
    return this.chatMessagesRepository.find({
      where: { senderId },
    });
  }

  // senderId, sendMessage로 채팅메시지 생성
  create({ senderId, sendMessage }) {
    return this.chatMessagesRepository.save({ senderId, sendMessage });
  }
}
