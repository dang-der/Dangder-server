import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { User } from '../entities/user.entity';

@ObjectType({ description: 'fetchLoginUser 의 Return Type' })
export class UserOutput {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Dog, { nullable: true })
  dog: Dog;
}
