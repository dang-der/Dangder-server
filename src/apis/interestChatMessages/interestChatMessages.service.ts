import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestChatMessage } from './entities/interestChatMessage.entity';

@Injectable()
export class InterestChatMessagesService {
  constructor(
    @InjectRepository(InterestChatMessage)
    private readonly interestChatMessagesRepository: Repository<InterestChatMessage>,
  ) {}

  /**
   * Find All InterestChatMessages of InterestChatRoom
   * @param iChatRoomId 관심사 채팅방 id
   * @returns 관심사 채팅방에 속한 모든 메시지들
   */
  findAllByIChatRoomId({ iChatRoomId }) {
    return this.interestChatMessagesRepository.find({
      where: { interestChatRoom: { id: iChatRoomId } },
      relations: { interestChatRoom: true },
      order: { chatCreatedAt: 'ASC' },
    });
  }

  /**
   * Delete ChatMessage (SoftDelete)
   * @param iChatRoomId 채팅방 id
   * @returns 메시지 삭제 여부
   */
  async delete({ iChatRoomId }) {
    const result = await this.interestChatMessagesRepository.softDelete({
      interestChatRoom: { id: iChatRoomId },
    });
    return result.affected ? true : false;
  }

  create({ iRoomId, testMsg }) {
    const result = this.interestChatMessagesRepository.save({
      senderId: "testSender",
      type: "test",
      message: testMsg,
      interestChatRoom: { id:iRoomId },
    });

    return result;
  }
}
