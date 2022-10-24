import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateReviewInput } from './createReview.input';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
  @Field(() => Int)
  id: number;
}
