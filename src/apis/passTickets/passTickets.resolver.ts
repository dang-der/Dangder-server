import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PassTicket } from './entities/passTicket.entity';
import { PassTicketsService } from './passTickets.service';

@Resolver()
export class PassTicketsResolver {
  constructor(private readonly passTicketsService: PassTicketsService) {}

  @Query(() => PassTicket)
  async fetchPassTicket({ id }) {
    return await this.passTicketsService.findPassTicket({ id });
  }

  @Mutation(() => PassTicket)
  async createPassTicket() {
    return await this.passTicketsService.create({ PassTicket });
  }

  @Mutation(() => Boolean)
  async deletePassTicket(
    @Args('id') id: string, //
  ) {
    return this.passTicketsService.deletePassTicket({ id });
  }
}
