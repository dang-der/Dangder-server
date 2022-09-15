import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '인기댕댕' })
export class TodayLikeDogOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  mainImg: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;
}
