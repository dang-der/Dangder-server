import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoomsOutput } from './dto/chatRoomsOutput.output';
import { ChatRoom } from './entities/chatRoom.entity';

/**
 * ChatRoom GraphQL API Resolver
 * @APIs `fetchChatRoom`, `createChatRoom`, `joinChatRoom`, `deleteChatRoom`
 */
@Resolver()
export class ChatRoomsResolver {
  constructor(
    private readonly chatRoomsService: ChatRoomsService, //
  ) {}

  /**
   * Fetch ChatRoom API - roomId 로 채팅방 조회
   * @type [`Query`]
   * @param roomId 채팅방 id
   * @returns 조회된 채팅방 정보
   */
  @Query(() => ChatRoom, {
    description: 'Return : 조회된 채팅방 정보',
  })
  fetchChatRoom(
    @Args('roomId', { description: '채팅방 id (roomId)' }) roomId: string,
  ) {
    return this.chatRoomsService.findOne({ roomId });
  }

  /**
   * Fetch ChatRooms API - dogId 로 본인이 참가한 채팅방들 불러오기
   * @param dogId 유저의 강아지 id
   * @returns 채팅방id, 상대 강아지정보, 채팅방의 마지막메시지
   */
  @Query(() => [ChatRoomsOutput], {
    description: 'Return : 채팅방id, 상대강아지정보, 채팅방의 마지막메시지',
  })
  fetchChatRooms(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
  ) {
    return this.chatRoomsService.findChatRooms({ dogId });
  }

  /**
   * Create ChatRoom API - 내 강아지 id와 상대방 강아지 id로 1:1 채팅방 만들기
   * @param dogId 내 강아지 id
   * @param chatPairId 상대방 강아지 id
   * @returns 생성된 1:1 채팅방의 정보
   */
  @Mutation(() => ChatRoom, { description: 'Return : 생성된 채팅방 정보' })
  createChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    return this.chatRoomsService.create({ dogId, chatPairId });
  }

  /**
   * Join ChatRoom API - 채팅방 참가하기. fetchChatRoom + createChatRoom
   * 이용권이 있는 유저와 없는 유저도 이 API 를 사용하여
   * 접속할 수 있는 ChatRoom의 정보를 받아올 수 있다.
   * 이용권이 없는 유저 - (Match 될 때, 채팅방이 생성되므로 fetch)
   * 이용권이 있는 유저 - (새로 채팅방을 생성해야하므로 create)
   * @param dogId 내 강아지 id
   * @param chatPairId 상대방 강아지 id
   * @returns 참가할 채팅방 정보(fetch + create)
   */
  @Mutation(() => ChatRoom, {
    description: 'Return : 참가할 채팅방 정보(fetch + create)',
  })
  async joinChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    // 내가 Host 이고, 상대가 Guest 인 방이 있는가
    const isOpenedByHost = await this.chatRoomsService.findChatRoom({
      dogId,
      chatPairId,
    });
    // 내가 Guest 이고, 상대가 Host 인 방이 있는가
    const isOpenedByGuest = await this.chatRoomsService.findChatRoom({
      dogId: chatPairId,
      chatPairId: dogId,
    });

    // 둘 다 없다면? 내가 Host로 새로운 채팅방 생성
    if (!isOpenedByHost && !isOpenedByGuest) {
      const createChatroom = await this.chatRoomsService.create({
        dogId,
        chatPairId,
      });
      return createChatroom;
    }
    // 이미 생성된 채팅방이 있다면? 채팅방 정보 리턴
    else return isOpenedByHost ? isOpenedByHost : isOpenedByGuest;
  }

  /**
   * Delete ChatRoom API - 채팅방 나가기 시, 채팅방 삭제
   * @param id 삭제할 채팅방의 id
   * @returns 채팅방의 삭제 여부 (true, false)
   */
  @Mutation(() => Boolean, {
    description: 'Return : 채팅방 삭제 여부  (true, false)',
  })
  async deleteChatRoom(@Args('id', { description: '채팅방 id' }) id: string) {
    return this.chatRoomsService.delete({ id });
  }
}
