import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAvoidBreedsInput {
  @Field(() => [String], { description: '기피견종명' })
  avoidBreed: string[];
}
