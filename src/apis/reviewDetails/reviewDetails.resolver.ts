import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewDetail } from './entities/reviewDetail.entity';
import { ReivewDetailsService } from './reviewDetails.service';
@Resolver()
export class ReivewDetailsResolver {
  constructor(private readonly reviewDetailsService: ReivewDetailsService) {}

  @Query(() => [ReviewDetail])
  fetchReviewDetails() {
    return this.reviewDetailsService.findAll();
  }

  @Mutation(() => ReviewDetail)
  createReviewDetail(
    @Args('reviewDetail', { description: '리뷰 상세 내용' })
    reviewDetail: string,
  ) {
    return this.reviewDetailsService.create(reviewDetail);
  }

  @Mutation(() => Boolean)
  deleteReviewDetail(
    @Args('id', { description: '삭제할 리뷰 디테일 uuid' }) id: string,
  ) {
    return this.reviewDetailsService.delete(id);
  }
}
