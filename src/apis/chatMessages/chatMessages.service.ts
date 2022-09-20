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
      order: { chatCreatedAt: 'ASC' },
    });
  }

  // senderId, message로 채팅메시지 생성
  create({ chatRoomId, chatMessageInput }) {
    return this.chatMessagesRepository.save({
      chatRoom: { id: chatRoomId },
      ...chatMessageInput,
    });
  }

  // chatRoomId 로 채팅방 삭제
  async delete({ chatRoomId }) {
    const result = await this.chatMessagesRepository.softDelete({
      chatRoom: { id: chatRoomId },
    });
    return result.affected ? true : false;
  }
}
