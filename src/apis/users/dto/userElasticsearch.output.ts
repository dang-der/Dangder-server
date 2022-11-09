import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';

@ObjectType()
export class UserElasticsearchOutPut {
  @Field(() => String)
  id: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  pet: boolean;

  @Field(() => Int)
  ddMoney: number;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => String)
  deletedAt: string;

  @Field(() => Int)
  reportCnt: number;

  @Field(() => Int)
  donateTotal: number;

  @Field(() => Boolean)
  isCert: boolean;

  @Field(() => String)
  donateGrade: string;

  @Field(() => Boolean)
  isStop: boolean;

  // 수정이 필요하다

  @Field(() => Dog, { nullable: true })
  dogId: Dog;

  @Field(() => Dog, { nullable: true })
  dogName: Dog;
}
