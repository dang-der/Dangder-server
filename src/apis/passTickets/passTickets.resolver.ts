import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PassTicket } from './entities/passTicket.entity';
import { PassTicketsService } from './passTickets.service';

/**
 * PassTicket GraphQL API Resolver
 * @APIs `fetchPassTicket`, `createPassTicket`, `deletePassTicket`
 */

@Resolver()
export class PassTicketsResolver {
  constructor(private readonly passTicketsService: PassTicketsService) {}

  /**
   * PassTicket Fetch API
   * @type [`Query`]
   * @param id 패스 티켓 아이디
   * @returns 조회한 패스 티켓 정보
   */
  @Query(() => PassTicket, { description: 'Return : 패스 티켓 정보' })
  async fetchPassTicket(
    @Args('id', { description: '패스 티켓 id' }) id: string, //
  ) {
    return await this.passTicketsService.findPassTicket({ id });
  }

  /**
   * PassTicket Create API
   * @type [`Mutation`]
   * @param userId 유저 아이디
   * @param expiredAt 만료 시간
   * @returns 생성된 티켓 정보
   */
  @Mutation(() => PassTicket, { description: 'Return : 생성된 패스 티켓 정보' })
  async createPassTicket(
    @Args('userId', { description: '유저 아이디' }) userId: string, //
    @Args('expiredAt', { description: '티켓 만료 시간' }) expiredAt: string,
  ) {
    return await this.passTicketsService.create({ userId, expiredAt });
  }
  /**
   * PassTicket Delete API
   * @type [`Mutation`]
   * @param id 패스 티켓 아이디
   * @returns true/false
   */
  @Mutation(() => Boolean, {
    description: 'Return : deletedAt(패스 티켓 정보 삭제된 시간)',
  })
  async deletePassTicket(
    @Args('id', { description: '패스 티켓 아이디' }) id: string, //
  ) {
    return this.passTicketsService.deletePassTicket({ id });
  }
}
