import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from '../chatRooms/chatRooms.service';
import { createLikeInput } from './dto/createLike.input';
import { CreateLikeOutput } from './dto/createLike.output';
import { TodayLikeDogOutput } from './dto/todayLikeDog.output';
import { LikesService } from './likes.service';

@Resolver()
export class LikesResolver {
  constructor(
    private readonly likesService: LikesService, //

    private readonly chatRoomsService: ChatRoomsService, //
  ) {}

  @Query(() => [TodayLikeDogOutput], {
    description: 'return : 좋아요 많이 받은 12마리 댕댕이',
  })
  fetchTodayDog() {
    return this.likesService.findTodayDog();
  }

  @Mutation(() => Boolean, {
    description:
      'return : 내가 좋아요 누른 댕댕이가 나를 좋아요 누른 기록 있는지 조회',
  })
  async isLike(
    @Args('sendId', { description: '나의 댕댕 uuid' }) sendId: string, //
    @Args('receiveId', { description: '내가 좋아요 누르는 상대의 댕댕 uuid' })
    receiveId: string, //
  ) {
    return this.likesService.isLike({ sendId, receiveId });
  }

  @Mutation(() => CreateLikeOutput, {
    description: 'return : 좋아요 매칭여부, sendId, DogId',
  })
  async createLike(
    @Args('createLikeInput', {
      description: 'sendId: 보내는 댕댕 uuid, receiveId: 받는 댕댕 uuid',
    })
    createLikeInput: createLikeInput, //
  ) {
    await this.likesService.create(createLikeInput);

    const isMatch = await this.likesService.isLike({
      sendId: createLikeInput.sendId,
      receiveId: createLikeInput.receiveId,
    });

    if (isMatch) {
      await this.chatRoomsService.create({
        dogId: createLikeInput.sendId,
        chatPairId: createLikeInput.receiveId,
      });
    }

    const result = new CreateLikeOutput();
    (result.sendId = createLikeInput.sendId),
      (result.receiveId = createLikeInput.receiveId),
      (result.isMatch = isMatch);

    return result;
  }
}
