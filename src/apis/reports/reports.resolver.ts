import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReportInput } from './dto/createReport.input';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  // 누가 신고했는가?
  @Query(() => Report, { description: 'Return : 신고 정보' })
  async fetchWhoReport(
    @Args('userId', { description: '신고한 유저 Id' }) userId: string, //
  ) {
    return this.reportsService.findByUserId({ userId });
  }

  // targetId로 신고게시판 조회
  @Query(() => Report, { description: 'Return : 신고 정보' })
  async fetchTarget(
    @Args('targetId', { description: '신고 당한 유저 Id' }) targetId: string, //
  ) {
    return this.reportsService.findByTargetId({ targetId });
  }

  // 신고 게시판 생성하기

  @Mutation(() => Report, { description: 'Return : 생성된 신고 게시물' })
  async createReport(
    @Args('userId', { description: '신고한 유저 Id' }) userId: string,
    @Args('createReportInput', { description: '신고 정보 입력' })
    CreateReportInput: CreateReportInput, //
  ) {
    return this.reportsService.create({ userId, CreateReportInput });
  }
}
