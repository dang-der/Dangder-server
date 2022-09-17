import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  // 채팅 메시지 저장
  async create({ roomId, senderId, type, data }) {
    const result = await this.chatMessagesRepository.save({
      chatRoom: { id: roomId },
      senderId,
      type,
      ...data,
    });
    return result;
  }
}
