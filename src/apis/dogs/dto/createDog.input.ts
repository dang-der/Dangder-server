import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class createDogInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => Boolean)
  isNeut: boolean;

  @Field(() => String)
  description: string;

  @Field(() => String)
  registerNumber: string;

  //테스트용, 추후 수정예정
  @Field(() => String)
  birthday: string;

  //테스트용, 추후 수정예정
  @Field(() => [String])
  interests: string[];

  //테스트용, 추후 수정예정
  @Field(() => [String])
  avoidBreeds: string[];

  //테스트용, 추후 수정예정
  @Field(() => [String])
  characters: string[];

  //테스트용, 추후 수정예정
  @Field(() => [String])
  breeds: string[];
}
