import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUser.input';

//PartialType(CreateProductInput)
//PickType(CreateProductInput, ['name' , 'price']) 필요한것만가져오기
//OmitType(CreateProductInput, ['description']) 필요없는것 제외하기

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int, { nullable: true })
  ddMoney: number;

  @Field(() => Int, { nullable: true })
  reportCnt: number;

  @Field(() => Int, { nullable: true })
  donateTotal: number;

  @Field(() => Boolean, { nullable: true })
  isCert: boolean;

  @Field(() => String, { nullable: true })
  donateGrade: string;
}
