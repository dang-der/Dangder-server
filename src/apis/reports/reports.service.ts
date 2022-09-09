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

  // 신고한 userId로 찾기
  findByUserId({ userId }) {
    return this.reportsRepository.findOne({ where: { user: { id: userId } } });
  }

  // 신고당한 Id로찾기
  findByTargetId({ targetId }) {
    return this.reportsRepository.findOne({ where: { targetId } });
  }

  // 신고 게시물 만들기

  async create({ userId, CreateReportInput }) {
    return this.reportsRepository.save({
      user: { id: userId },
      ...CreateReportInput,
    });
  }
}
