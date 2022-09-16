import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,
  ) {}

  // 채팅방 id, 본인 id, 상대방 id로 저장
  create({ dogId, chatPairId }) {
    return this.chatRoomsRepository.save({ dog: { id: dogId }, chatPairId });
  }

  // 채팅방을 찾는 로직. dogId와 chatPairId로 찾는다.
  async findChatRoom({ dogId, chatPairId }) {
    const result = await this.chatRoomsRepository.findOne({
      where: { dog: { id: dogId }, chatPairId },
      relations: { dog: true },
    });
    return result;
  }

  // 채팅방들을 찾는 로직. dogId로 참가한 채팅방들을 찾는다.
  async findChatRooms({ dogId }) {
    const result = await this.chatRoomsRepository.find({
      where: { dog: { id: dogId } },
      relations: { dog: true },
    });
    return result;
  }

  // chatRoomId 로 채팅방, 연결된 채팅메시지들 삭제
  async delete({ id }) {
    await this.chatMessagesRepository.softDelete({
      chatRoom: { id },
    });
    const result = await this.chatRoomsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
