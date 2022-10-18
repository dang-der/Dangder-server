import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInterestInput {
  @Field(() => String)
  interest: string;

  @Field(() => String)
  interestImg: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  subTitle: string;
}
