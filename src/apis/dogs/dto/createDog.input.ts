import { Field, InputType, Int } from '@nestjs/graphql';
import { LocationInput } from 'src/apis/locations/dto/location.input';

@InputType()
export class createDogInput {
  @Field(() => Int)
  age: number;

  @Field(() => String)
  description: string;

  @Field(() => String)
  birthday: string;

  @Field(() => [String], { nullable: true })
  interests: string[];

  @Field(() => [String], { nullable: true })
  avoidBreeds: string[];

  @Field(() => [String], { nullable: true })
  characters: string[];

  @Field(() => [String])
  img: string[];

  @Field(() => String)
  userId: string;

  @Field(() => LocationInput)
  locations: LocationInput;
}
