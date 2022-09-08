import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chatRoom.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,
  ) {}

  // 채팅방 id, 본인 id, 상대방 id로 저장
  create({ dogId, chatPairId }) {
    return this.chatRoomsRepository.save({ dog: { id: dogId }, chatPairId });
  }

  // 채팅방을 찾는 로직. dogId와 chatPairId로 찾는다.
  findChatRoom({ dogId, chatPairId }) {
    return this.chatRoomsRepository.find({
      where: { dog: { id: dogId }, chatPairId },
    });
  }

  async delete({ id }) {
    //softDelete
    const result = await this.chatRoomsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
