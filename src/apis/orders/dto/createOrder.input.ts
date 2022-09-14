import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => String, { nullable: true })
  comment: string;

  @Field(() => String)
  receiver: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Int, { defaultValue: 0 })
  goodsQnt: number;
}
