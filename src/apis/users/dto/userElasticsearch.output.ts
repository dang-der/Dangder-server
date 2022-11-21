import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserElasticsearchOutPut {
  @Field(() => String)
  email: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String, { nullable: true })
  deletedAt: string;

  @Field(() => Int, { nullable: true })
  reportCnt: number;

  @Field(() => Boolean, { nullable: true })
  isStop: boolean;

  @Field(() => String, { nullable: true })
  dogId: string;

  @Field(() => String, { nullable: true })
  dogName: string;
}
