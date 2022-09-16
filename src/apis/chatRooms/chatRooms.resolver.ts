import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Resolver()
export class ChatRoomsResolver {
  constructor(
    private readonly chatRoomsService: ChatRoomsService, //
  ) {}

  // dogId와 chatPairId로 채팅방 조회
  @Query(() => ChatRoom, {
    description: 'Return : 조회된 채팅방 정보',
  })
  fetchChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    return this.chatRoomsService.findChatRoom({ dogId, chatPairId });
  }

  // dogId와 chatPairId로 채팅방 조회
  @Query(() => [ChatRoom], {
    description: 'Return : dogId로 참가한 채팅방들의 정보',
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
    const isOpened = await this.chatRoomsService.findChatRoom({
      dogId,
      chatPairId,
    });
    if (!isOpened) {
      const createChatroom = await this.chatRoomsService.create({
        dogId,
        chatPairId,
      });
      return createChatroom;
    } else return isOpened;
  }

  // 채팅방 삭제(softDelete)
  @Mutation(() => Boolean, {
    description: 'Return : 채팅방 삭제 여부  (true, false)',
  })
  async deleteChatRoom(@Args('id', { description: '채팅방 id' }) id: string) {
    return this.chatRoomsService.delete({ id });
  }
}
