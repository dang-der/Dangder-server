import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { InterestChatRoomsService } from './interestChatRooms.service';
import { InterestChatRoom } from './entities/interestChatRoom.entity';

/**
 * InterestChatRoom GraphQL API Resolver
 * @APIs `fetchIChatRoom`, `createIChatRoom`, `joinIChatRoom`, `deleteIChatRoom`
 */
@Resolver()
export class InterestChatRoomsResolver {
  constructor(
    private readonly interestChatRoomsService: InterestChatRoomsService, //
  ) {}

  /**
   * Fetch InterestChatRoom API - roomId 로 채팅방 조회
   * @type [`Query`]
   * @param iRoomId 관심사 채팅방 id
   * @returns 조회된 채팅방 정보
   */
  @Query(() => InterestChatRoom, {
    description: 'Return : 조회된 관심사 채팅방 정보',
  })
  fetchInterestChatRoom(
    @Args('iRoomId', { description: '관심사 채팅방 id (iRoomId)' })
    iRoomId: string,
  ) {
    return this.interestChatRoomsService.findOne({ iRoomId });
  }

  @Mutation(() => InterestChatRoom, {
    description: 'Return : 참가할 채팅방 정보',
  })
  async joinIChatRoom(
    @Args('email', { description: '사용자의 email' }) email: string,
    @Args('iChatRoomId', { description: '입장할 관심사 채팅방의 id' })
    iChatRoomId: string,
  ) {
    const result = await this.interestChatRoomsService.findOneToValidUser({
      email,
      iChatRoomId,
    });

    return result;
  }

  /**
   * Delete InterestChatRoom API - 채팅방 나가기 시, 채팅방 삭제
   * @param id 삭제할 채팅방의 id
   * @returns 채팅방의 삭제 여부 (true, false)
   */
  @Mutation(() => Boolean, {
    description: 'Return : 채팅방 삭제 여부  (true, false)',
  })
  async deleteInterestChatRoom(
    @Args('id', { description: '채팅방 id' }) id: string,
  ) {
    return this.interestChatRoomsService.delete({ id });
  }
}
