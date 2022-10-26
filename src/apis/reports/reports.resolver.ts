import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockUsersService } from '../blockUsers/blockUsers.service';
import { UsersService } from '../users/users.service';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

/**
 * Report GraphQL API Resolver
 * @APIs `fetchWhoReport`, `fetchTarget`, `createReport`
 */
@Resolver()
export class ReportsResolver {
  constructor(
    private readonly reportsService: ReportsService, //
    private readonly blockUsersService: BlockUsersService, //
    private readonly usersService: UsersService, //
  ) {}

  /**
   * Fetch Who Report API
   * @type [`Query`]
   * @param userId
   * @returns 신고 정보
   */
  @Query(() => Report, { description: 'Return : 신고 정보' })
  async fetchWhoReport(
    @Args('userId', { description: '신고한 유저 Id' }) userId: string, //
  ) {
    return this.reportsService.findByUserId({ userId });
  }

  /**
   * Fetch Who Reported API
   * @type [`Query`]
   * @param targetId 차단된 유저 Id
   * @returns 신고 정보
   */
  @Query(() => Report, { description: 'Return : 신고 정보' })
  async fetchTarget(
    @Args('targetId', { description: '신고 당한 유저 Id' }) targetId: string, //
  ) {
    return this.reportsService.findByTargetId({ targetId });
  }

  /**
   * Report Create API
   * @type [`Mutation`]
   * @param userId 신고한 유저 Id
   * @param targetId 신고당한 유저 Id
   * @returns 생성된 신고 게시물
   */

  @Mutation(() => Report, { description: 'Return : 생성된 신고 게시물' })
  async createReport(
    @Args('userId', { description: '신고 한 Id' }) userId: string,
    @Args('targetId', { description: '신고 당한 Id' }) targetId: string,
    @Args('reportContent', { description: '신고 내용' }) reportContent: string,
  ) {
    await this.blockUsersService.create({
      userId,
      blockId: targetId,
    });

    await this.usersService.changeReportCnt({
      id: targetId,
    });

    return this.reportsService.create({ userId, targetId, reportContent });
  }
}
