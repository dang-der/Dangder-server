import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Like } from './entities/like.entity';
import { LikesService } from './likes.service';

@Resolver()
export class LikesResolver {
  constructor(
    private readonly likesSerivce: LikesService, //
  ) {}

  @Query(() => [Like])
  async fetchLikes(
    @Args('receiveId') receiveId: string, // 내가받은 좋아요 목록 조회
  ) {
    return this.likesSerivce.findAll(receiveId);
  }

  @Mutation(() => Like)
  async createLike(
    @Args('sendId') sendId: string, //
    @Args('receiveId') receiveId: string,
  ) {
    return this.likesSerivce.create(sendId, receiveId);
  }
}
