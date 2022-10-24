import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  reviewMessage: string;

  @Field(() => String)
  reviewDetail: string;
}
