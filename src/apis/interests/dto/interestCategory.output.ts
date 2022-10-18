import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterestCategoryOutput {
  @Field(() => String)
  interest: string;

  @Field(() => String)
  interestImg: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  subTitle: string;
}
