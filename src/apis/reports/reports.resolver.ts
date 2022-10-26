import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockUsersService } from '../blockUsers/blockUsers.service';
import { CreateReportInput } from './dto/createReport.input';
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
  ) {}

  /**
   * Fetch Who Report API
   * @type [`Query`]
   * @param reportId
   * @returns 신고 정보
   */
  @Query(() => Report, { description: 'Return : 신고 정보' })
  async fetchWhoReport(
    @Args('reportId', { description: '신고한 유저 Id' }) reportId: string, //
  ) {
    return this.reportsService.findByReportId({ reportId });
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
   * @param createReportInput 신고 정보 입력
   * @returns 생성된 신고 게시물
   */

  @Mutation(() => Report, { description: 'Return : 생성된 신고 게시물' })
  async createReport(
    @Args('createReportInput', { description: '신고 정보 입력' })
    createReportInput: CreateReportInput, //
  ) {
    const reportCreate = await this.reportsService.create({
      createReportInput,
    });

    await this.blockUsersService.create({
      userId: createReportInput.reportId,
      blockId: createReportInput.targetId,
    });

    return reportCreate;
  }
}
