import { Query, Args, Resolver, Mutation } from '@nestjs/graphql';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessageInput } from './dto/chatMessageInput.input';
import { ChatMessage } from './entities/chatMessage.entity';

/**
 * ChatMessage GraphQL API Resolver
 * @APIs `fetchChatMessagesByChatRoomId`, `createChatMessage`
 */
@Resolver()
export class ChatMessagesResolver {
  constructor(
    private readonly chatMessagesService: ChatMessagesService, //
  ) {}

  /**
   * Fetch ChatMessages API
   * @type [`Query`]
   * @param chatRoomId 채팅방 id
   * @returns 채팅방에 속한 모든 채팅 메시지들
   */
  @Query(() => [ChatMessage], {
    description: 'Return : chatRoomId로 찾은 메시지들의 정보',
  })
  fetchChatMessagesByChatRoomId(
    @Args('chatRoomId', { description: '채팅방 id' }) chatRoomId: string, // 추후 채팅방Id 추가 필요
  ) {
    return this.chatMessagesService.findAllByChatRoomId({ chatRoomId });
  }

  /**
   * Create ChatMessage API
   * @type [`Mutation`]
   * @param chatRoomId 채팅방 아이디
   * @param chatMessageInput 보낼 메시지 Data
   * @returns 생성된 메시지 정보
   */
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
