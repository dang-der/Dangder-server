import { Field, InputType, Int } from '@nestjs/graphql';
import { LocationInput } from 'src/apis/locations/dto/location.input';

@InputType()
export class createDogInput {
  @Field(() => Int)
  age: number;

  @Field(() => String)
  description: string;

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

  @Field(() => [String])
  img: string[];

  @Field(() => LocationInput)
  locations: LocationInput;
}
