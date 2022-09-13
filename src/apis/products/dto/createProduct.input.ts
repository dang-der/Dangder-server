import { Field, InputType, Int } from '@nestjs/graphql';
import { Column } from 'typeorm';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  productName: string;

  @Column()
  @Field(() => Int, { defaultValue: 0 })
  price: number;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  description: string;
}
