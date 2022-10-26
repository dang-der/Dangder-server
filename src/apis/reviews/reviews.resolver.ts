import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/createReview.input';
import { UpdateReviewInput } from './dto/updateReview.input';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query(() => [Review])
  fetchReceiveReviews(
    @Args('id', {
      description: '내가 받은 리뷰들을 조회하기 위한 내 강아지 uuid',
    })
    id: string,
  ) {
    return this.reviewsService.findReceive(id);
  }

  @Query(() => [Review])
  fetchSendReviews(
    @Args('id', {
      description: '내가 작성한 리뷰들을 조회하기 위한 내 강아지 uuid',
    })
    id: string,
  ) {
    return this.reviewsService.findSend(id);
  }

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ) {
    return this.reviewsService.create(createReviewInput);
  }

  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ) {
    return this.reviewsService.update(updateReviewInput);
  }

  @Mutation(() => Boolean)
  deleteReview(
    @Args('id') id: string, //
  ) {
    return this.reviewsService.delete({ id });
  }
}
