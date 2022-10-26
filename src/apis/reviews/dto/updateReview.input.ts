import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReviewInput } from './createReview.input';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
