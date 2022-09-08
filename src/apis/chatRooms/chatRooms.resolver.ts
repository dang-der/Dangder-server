import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Resolver()
export class ChatRoomsResolver {
  constructor(
    private readonly chatRoomsService: ChatRoomsService, //
  ) {}

  // dogId와 chatPairId로 채팅방 조회

  @Query(() => [ChatRoom])
  fetchChatRoom(
    @Args('dogId') dogId: string,
    @Args('chatPairId') chatPairId: string,
  ) {
    return this.chatRoomsService.findChatRoom({ dogId, chatPairId });
  }

  // 채팅방 생성
  @Mutation(() => ChatRoom)
  async createChatRoom(
    @Args('dogId') dogId: string,
    @Args('chatPairId') chatPairId: string,
  ) {
    return this.chatRoomsService.create({ dogId, chatPairId });
  }

  // 채팅방 삭제(softDelete)
  @Mutation(() => Boolean)
  async deleteChatRoom(@Args('id') id: string) {
    return this.chatRoomsService.delete({ id });
  }
}
