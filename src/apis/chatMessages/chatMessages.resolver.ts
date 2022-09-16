import { Query, Args, Resolver, Mutation } from '@nestjs/graphql';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessageInput } from './dto/chatMessageInput.input';
import { ChatMessage } from './entities/chatMessage.entity';

@Resolver()
export class ChatMessagesResolver {
  constructor(
    private readonly chatMessagesService: ChatMessagesService, //
  ) {}

  // chatRoomId로 채팅방 내의 모든 메시지 찾기
  @Query(() => [ChatMessage], {
    description: 'Return : chatRoomId로 찾은 메시지들의 정보',
  })
  fetchChatMessagesByChatRoomId(
    @Args('chatRoomId', { description: '채팅방 id' }) chatRoomId: string, // 추후 채팅방Id 추가 필요
  ) {
    return this.chatMessagesService.findAllByChatRoomId({ chatRoomId });
  }

  // 채팅메시지 생성
  @Mutation(() => ChatMessage, {
    description: 'Return : 생성된 채팅 메시지 정보',
  })
  async createChatMessage(
    @Args('chatRoomId', { description: '채팅방 id' }) chatRoomId: string,
    @Args('chatMessageInput', { description: '보낼 메시지 Data' })
    chatMessageInput: ChatMessageInput,
  ) {
    return this.chatMessagesService.create({
      chatRoomId,
      chatMessageInput,
    });
  }
}
