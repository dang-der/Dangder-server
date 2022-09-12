import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createLikeInput } from './dto/createLike.input';
import { Like } from './entities/like.entity';
import { LikesService } from './likes.service';

@Resolver()
export class LikesResolver {
  constructor(
    private readonly likesService: LikesService, //
  ) {}

  @Mutation(() => Boolean, {
    description: '내가 좋아요 누른 댕댕이가 나를 좋아요 누른 기록 있는지 조회',
  })
  async isLike(
    @Args('sendId') sendId: string, //
    @Args('receivedId') receivedId: string, //
  ) {
    return this.likesService.isLike({ sendId, receivedId });
  }

  @Mutation(() => Like, {
    description: '이 댕댕이에게 좋아요를 누르기',
  })
  async createLike(
    @Args('createLikeInput') createLikeInput: createLikeInput, //
  ) {
    return this.likesService.create(createLikeInput);
  }
}
