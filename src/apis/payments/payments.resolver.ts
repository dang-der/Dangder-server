import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  createPayment(
    @Args('impUid') impUid: string, //
    @Args('payMoney') payMoney: number,
    @Context() context: IContext,
  ) {
    console.log(context);
    return this.paymentsService.create({ impUid, payMoney, context });
  }
}
