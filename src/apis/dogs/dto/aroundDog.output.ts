import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AroundDogOutput {
  @Field(() => String)
  dogId: string;

  @Field(() => Int)
  distance: number;
}
