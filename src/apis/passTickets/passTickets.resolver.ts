import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PassTicket } from './entities/passTicket.entity';
import { PassTicketsService } from './passTickets.service';

@Resolver()
export class PassTicketsResolver {
  constructor(private readonly passTicketsService: PassTicketsService) {}

  @Query(() => PassTicket)
  async fetchPassTicket(
    @Args('id') id: string, //
  ) {
    return await this.passTicketsService.findPassTicket({ id });
  }

  // userId와 연결
  @Mutation(() => PassTicket)
  async createPassTicket(
    @Args('userId') userId: string, //
    @Args('expiredAt') expiredAt: string,
  ) {
    return await this.passTicketsService.create({ userId, expiredAt });
  }

  @Mutation(() => Boolean)
  async deletePassTicket(
    @Args('id') id: string, //
  ) {
    return this.passTicketsService.deletePassTicket({ id });
  }
}
