import { Query, Args, Resolver, Mutation } from '@nestjs/graphql';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessage } from './entities/chatMessage.entity';

@Resolver()
export class ChatMessagesResolver {
  constructor(
    private readonly chatMessagesService: ChatMessagesService, //
  ) {}

  // 보낸 유저의 id 와 일치하는 메시지 전부 찾기
  @Query(() => [ChatMessage])
  fetchChatMessagesBySenderId(
    @Args('senderId') senderId: string, // 추후 채팅방Id 추가 필요
  ) {
    return this.chatMessagesService.findAllBySenderId({ senderId });
  }

  @Mutation(() => ChatMessage)

  // 채팅메시지 한 줄 한 줄 생성
  async createChatMessage(
    // 보낸 사람과
    // 보낸 메시지
    @Args('senderId') senderId: string,
    @Args('sendMessage') sendMessage: string,
  ) {
    return this.chatMessagesService.create({ senderId, sendMessage });
  }
}
