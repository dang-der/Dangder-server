import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserElasticsearchOutPut {
  @Field(() => String)
  email: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  deletedAt: string;

  @Field(() => Int)
  reportCnt: number;

  @Field(() => Boolean)
  isStop: boolean;

  @Field(() => String, { nullable: true })
  dogId: string;

  @Field(() => String, { nullable: true })
  dogName: string;
}
