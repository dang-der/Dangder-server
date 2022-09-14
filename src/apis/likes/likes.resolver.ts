import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatRoomsService } from '../chatRooms/chatRooms.service';
import { Dog } from '../dogs/entities/dog.entity';
import { createLikeInput } from './dto/createLike.input';
import { TodayLikeDogOutput } from './dto/todayLikeDog.output';
import { Like } from './entities/like.entity';
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
  fetchTodayDog(): Promise<TodayLikeDogOutput[]> {
    return this.likesService.findTodayDog();
  }

  @Mutation(() => Boolean, {
    description:
      'return : 내가 좋아요 누른 댕댕이가 나를 좋아요 누른 기록 있는지 조회',
  })
  async isLike(
    @Args('sendId') sendId: string, //
    @Args('receiveId') receiveId: string, //
  ) {
    return this.likesService.isLike({ sendId, receiveId });
  }

  @Mutation(() => Like, {
    description: 'return : 이 댕댕이에게 좋아요를 누르기',
  })
  async createLike(
    @Args('createLikeInput') createLikeInput: createLikeInput, //
  ) {
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
    return this.likesService.create(createLikeInput);
  }
}
