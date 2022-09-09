import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReportInput } from './dto/createReport.input';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  // 누가 신고했는가?
  @Query(() => Report, { description: 'userId를 통해 신고게시판 조회' })
  async fetchWhoReport(
    @Args('userId') userId: string, //
  ) {
    return this.reportsService.findByUserId({ userId });
  }

  // targetId로 신고게시판 조회
  @Query(() => Report)
  async fetchTarget(
    @Args('targetId') targetId: string, //
  ) {
    return this.reportsService.findByTargetId({ targetId });
  }

  // 신고 게시판 생성하기

  @Mutation(() => Report)
  async createReport(
    @Args('userId') userId: string,
    @Args('createReportInput') CreateReportInput: CreateReportInput, //
  ) {
    return this.reportsService.create({ userId, CreateReportInput });
  }
}
