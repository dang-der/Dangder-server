import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'fetchPayments의 Return Type' })
export class PaymentOutput {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => Number, { nullable: true })
  payMoney: number;

  @Field(() => String, { nullable: true })
  paymentType: string;

  @Field(() => Date, { nullable: true })
  createdAt: Date;
}
