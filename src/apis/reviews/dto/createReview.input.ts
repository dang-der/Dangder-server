import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  sendReview: string;

  @Field(() => String)
  receiveReviewId: string;

  @Field(() => String)
  reviewMessage: string;

  @Field(() => String)
  reviewDetail: string;
}