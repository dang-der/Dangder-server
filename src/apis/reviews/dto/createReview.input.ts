import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  sendReview: string;

  @Field(() => String)
  receiveReviewId: string;

  @Field(() => String, { nullable: true })
  reviewMessage: string;

  @Field(() => [String], { nullable: true })
  reviewDetail: string[];
}
