import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestChatMessage } from '../interestChatMessages/entities/interestChatMessage.entity';
import { InterestChatRoom } from './entities/interestChatRoom.entity';
import { Cache } from 'cache-manager';

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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

  async findOneToValidUser({ email, iChatRoomId }) {
    // 1. 채팅룸을 이용할 수 있는 유저인지 판별
    // 1-1. 유효한 이용권을 이용중인가?
    const isCert = await this.cacheManager.get(`${email}:cert`);
    if (isCert)
      // 이용권이 유효할 때, 채팅방 정보를 반환
      return this.findOne({ iRoomId: iChatRoomId });

    // 블랙리스트(24시간)와 접속인증키(5분) 조회
    const cnt24Hours = await this.cacheManager.get(`${email}:blockIChatRoom`);
    const isValid = await this.cacheManager.get(`${email}:allowIChatRoom`);

    // 1-2. 접속인증키가 유효할 때, 채팅방 정보를 반환
    if (cnt24Hours && isValid) return this.findOne({ iRoomId: iChatRoomId });

    // 1-3. 접속인증키 만료시, 에러메시지 반환
    // 이용권 만료 / 접속인증키 만료 / 블랙리스트 유효
    if (cnt24Hours && !isValid)
      throw new UnauthorizedException(
        '(댕더패스 미사용(만료) 유저) - 관심사 그룹채팅방은 24시간마다 5분씩 이용 가능합니다.',
      );

    // 2. 블랙리스트도, 접속인증키도 없는 유저
    // -> 두 key 모두 발급 후, 채팅방 정보를 반환
    if (!cnt24Hours && !isValid) {
      await this.cacheManager.set(`${email}:blockIChatRoom`, true, {
        ttl: 60 * 60 * 24, // sec * min * hour (24h)
      });
      await this.cacheManager.set(`${email}:allowIChatRoom`, true, {
        ttl: 60 * 5, // sec * min (5m)
      });
      return this.findOne({ iRoomId: iChatRoomId });
    }

    // 3. error
    throw new NotFoundException('접속 인증정보를 불러올 수 없습니다.');
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
