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
    description: '조회된 채팅방 정보(조회 실패시 false)',
  })
  fetchChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    return this.chatRoomsService.findChatRoom({ dogId, chatPairId });
  }

  // 채팅방 생성
  @Mutation(() => ChatRoom, { description: '생성된 채팅방 정보' })
  async createChatRoom(
    @Args('dogId', { description: '내 강아지 id (dogId)' }) dogId: string,
    @Args('chatPairId', { description: '채팅 상대 강아지 id (chatPairId)' })
    chatPairId: string,
  ) {
    return this.chatRoomsService.create({ dogId, chatPairId });
  }

  // 채팅방 삭제(softDelete)
  @Mutation(() => Boolean, {
    description: 'Return : 채팅방 삭제 여부  (true, false)',
  })
  async deleteChatRoom(@Args('id', { description: '채팅방 id' }) id: string) {
    return this.chatRoomsService.delete({ id });
  }
}
