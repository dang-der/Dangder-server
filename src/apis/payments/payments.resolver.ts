import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user.param';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => Payment)
  createPayment(
    @Args('id') id: string, //
    @Args('payMoney') payMoney: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.paymentsService.create({ id, payMoney, currentUser });
  }
}
