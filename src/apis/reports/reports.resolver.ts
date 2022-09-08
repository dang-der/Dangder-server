import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateReportInput } from './dto/createReport.input';
import { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  // id로 신고게시판 조회
  @Query(() => Report)
  async fetchReport(
    @Args('id') id: string, //
  ) {
    return this.reportsService.findreportId({ id });
  }

  // reportedId로 신고게시판 조회
  @Query(() => Report)
  async fetchReported(
    @Args('reportedId') reportId: string, //
  ) {
    return this.reportsService.findreportedId({ reportId });
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
