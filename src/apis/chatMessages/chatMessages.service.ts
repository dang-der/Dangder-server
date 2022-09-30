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

  /**
   * Find All ChatMessages of ChatRoom
   * @param chatRoomId 채팅방 id
   * @returns 채팅방에 속한 모든 메시지들
   */
  findAllByChatRoomId({ chatRoomId }) {
    return this.chatMessagesRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      relations: { chatRoom: true },
      order: { chatCreatedAt: 'ASC' },
    });
  }

  /**
   * Create ChatMessage
   * @param chatRoomId 채팅방 id
   * @param chatMessageInput 메시지 Data
   * @returns 생성된 message 정보
   */
  create({ chatRoomId, chatMessageInput }) {
    return this.chatMessagesRepository.save({
      chatRoom: { id: chatRoomId },
      ...chatMessageInput,
    });
  }

  /**
   * Delete ChatMessage (SoftDelete)
   * @param chatRoomId 채팅방 id
   * @returns 메시지 삭제 여부
   */
  async delete({ chatRoomId }) {
    const result = await this.chatMessagesRepository.softDelete({
      chatRoom: { id: chatRoomId },
    });
    return result.affected ? true : false;
  }
}
