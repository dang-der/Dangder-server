import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createAvoidBreedInput {
  @Field(() => [String])
  avoidBreed: string[];
}
