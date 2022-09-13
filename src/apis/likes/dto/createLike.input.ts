import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createLikeInput {
  @Field(() => String)
  receivedId: string;

  @Field(() => String)
  sendId: string;
}
