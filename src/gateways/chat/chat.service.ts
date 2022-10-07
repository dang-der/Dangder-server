import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { Repository } from 'typeorm';

/**
 * Chat Service
 */
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  /**
   * Create ChatMessage
   * 채팅 메시지 수신하여 DB에 저장
   * @param roomId 메시지가 속한 채팅방 id
   * @param senderId 메시지를 보낸 사용자의 id
   * @param type 메시지 형식 (약속장소, 약속시간, 메시지)
   * @param data 메시지 데이터
   * @returns 저장된 메시지 정보
   */
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
