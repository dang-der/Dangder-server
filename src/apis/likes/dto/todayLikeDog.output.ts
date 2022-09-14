import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '인기댕댕' })
export class TodayLikeDogOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  sendId: string;

  @Field(() => String)
  receivedId: string;
}
