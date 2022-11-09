import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DogElasticsearchOutPut {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  gender: string;

  @Field(() => String)
  registerNumber: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => String)
  createdAt: string;

  @Field(() => String, { nullable: true })
  deletedAt: string;

  @Field(() => String, { nullable: true })
  updatedAt: string;
}
