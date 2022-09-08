import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  // 신고한 Id 찾기
  findreportId({ id }) {
    return this.reportsRepository.findOne({ where: { id } });
  }

  // 신고당한 Id 찾기
  findreportedId({ reportId }) {
    return this.reportsRepository.findOne({ where: { reportId } });
  }

  // 신고 게시물 만들기

  async create({ userId, CreateReportInput }) {
    return this.reportsRepository.save({
      user: { id: userId },
      ...CreateReportInput,
    });
  }
}
