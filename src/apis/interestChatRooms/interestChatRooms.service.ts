import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestChatMessage } from '../interestChatMessages/entities/interestChatMessage.entity';
import { InterestChatRoom } from './entities/interestChatRoom.entity';

/**
 * InterestChatRoom Service
 */
@Injectable()
export class InterestChatRoomsService {
  constructor(
    @InjectRepository(InterestChatRoom)
    private readonly interestChatRoomsRepository: Repository<InterestChatRoom>,

    @InjectRepository(InterestChatMessage)
    private readonly interestChatMessagesRepository: Repository<InterestChatMessage>,
  ) {}

  /**
   * Create InterestChatRoom (with Interest Info)
   * 관심사 생성 시, 관심사 채팅방도 함께 생성
   * @param interest 관심사 정보
   * @returns 생성된 관심사 채팅방 정보
   */
  async create({ interest }) {
    const result = await this.interestChatRoomsRepository.save({
      interest,
    });

    return result;
  }

  /**
   * Find InterestChatRoom by InterestChatRoom Id
   * @param iRoomId 찾고자하는 관심사 채팅방 id
   * @returns 찾은 관심사 채팅방 정보
   */
  async findOne({ iRoomId }) {
    const result = await this.interestChatRoomsRepository.findOne({
      where: { id: iRoomId },
      relations: { interest: true },
    });
    return result;
  }

  /**
   * Delete InterestChatRoom (softDelete)
   * @param id 관심사 채팅방 id
   * @returns 관심사 채팅방 삭제 여부
   */
  async delete({ id }) {
    // 채팅방에 속한 메시지들도 모두 삭제.
    await this.interestChatMessagesRepository.softDelete({
      interestChatRoom: { id },
    });
    const result = await this.interestChatRoomsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
