import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createLikeInput {
  @Field(() => String)
  receiveId: string;

  @Field(() => String)
  sendId: string;
}
