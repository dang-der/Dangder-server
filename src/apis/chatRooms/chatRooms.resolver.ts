import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoomsOutput } from './dto/chatRoomsOutput.output';
import { ChatRoom } from './entities/chatRoom.entity';

@Resolver()
export class ChatRoomsResolver {
  constructor(
    private readonly chatRoomsService: ChatRoomsService, //
  ) {}

  // roomId로 채팅방 조회
  @Query(() => ChatRoom, {
    description: 'Return : 조회된 채팅방 정보',
  })
  fetchChatRoom(@Args('roomId', { description: '채팅방 id' }) roomId: string) {
    return this.chatRoomsService.findChatRoom({ roomId });
  }

  // dogId와 chatPairId로 채팅방 조회
  @Query(() => [ChatRoomsOutput], {
    description:
      'Return : 채팅방id, 상대강아지정보, 나의강아지정보, 채팅방의 마지막메시지',
  })
  fetchChatRooms(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
  ) {
    return this.chatRoomsService.findChatRooms({ dogId });
  }

  // 채팅방 생성
  @Mutation(() => ChatRoom, { description: 'Return : 생성된 채팅방 정보' })
  createChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    return this.chatRoomsService.create({ dogId, chatPairId });
  }

  // 채팅방 참가 - fetchChatRoom + createChatRoom
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

  // 채팅방 삭제(softDelete)
  @Mutation(() => Boolean, {
    description: 'Return : 채팅방 삭제 여부  (true, false)',
  })
  async deleteChatRoom(@Args('id', { description: '채팅방 id' }) id: string) {
    return this.chatRoomsService.delete({ id });
  }
}
