import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { InterestChatMessagesService } from './interestChatMessages.service';
import { InterestChatMessage } from './entities/interestChatMessage.entity';

/**
 * InterestChatMessage GraphQL API Resolver
 * @APIs `fetchIChatMessagesByIChatRoomId`
 */
@Resolver()
export class InterestChatMessagesResolver {
  constructor(
    private readonly interestChatMessagesService: InterestChatMessagesService, //
  ) {}

  /**
   * Fetch InterestChatMessages API
   * @type [`Query`]
   * @param iChatRoomId 채팅방 id
   * @returns 채팅방에 속한 모든 채팅 메시지들
   */
  @Query(() => [InterestChatMessage], {
    description: 'Return : iChatRoomId로 찾은 메시지들의 정보',
  })
  fetchIChatMessagesByIChatRoomId(
    @Args('iChatRoomId', { description: '관심사 채팅방 id' })
    iChatRoomId: string,
  ) {
    return this.interestChatMessagesService.findAllByIChatRoomId({
      iChatRoomId,
    });
  }

  @Mutation(() => InterestChatMessage)
  createIChatMessage(
    @Args('iRoomId') iRoomId: string, //
    @Args('testMsg') testMsg: string, //
  ) {
    return this.interestChatMessagesService.create({ iRoomId, testMsg });
  }
}
