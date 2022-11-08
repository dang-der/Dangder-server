import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

/**
 * Report Service
 */
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  /**
   *  Find By User Id
   *  @param userId
   *  @returns 신고한 유저아이디로 찾은 신고 정보
   */
  findByUserId({ userId, page }) {
    return this.reportsRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      where: { user: { id: userId } },
      relations: { user: true },
    });
  }

  /**
   * Find By Target Id
   * @param targetId 신고당한 Id
   * @returns 신고당한 유저아이디로 찾은 신고 정보
   */
  findByTargetId({ targetId, page }) {
    return this.reportsRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      where: { targetId },
      relations: { user: true },
    });
  }

  /**
   * Create Report
   * @param userId 신고한 유저 Id
   * @param targetId 신고당한 유저 Id
   * @param reportContent 신고 내용
   * @returns 생성된 신고 정보
   */
  async create({ userId, targetId, reportContent }) {
    return this.reportsRepository.save({
      user: { id: userId },
      targetId,
      reportContent,
      relations: {
        user: true,
      },
    });
  }
}
//
