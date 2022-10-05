import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassTicket } from './entities/passTicket.entity';

/**
 * PassTicket Service
 */
@Injectable()
export class PassTicketsService {
  constructor(
    @InjectRepository(PassTicket)
    private readonly passTicketsRepository: Repository<PassTicket>,
  ) {}

  /**
   * Create PassTicket
   * @param userId 유저 아이디
   * @param expiredAt 만료 시간
   * @returns 생성된 패스 티켓 정보
   */

  async create({ userId, expiredAt }) {
    return this.passTicketsRepository.save({
      user: { id: userId },
      expiredAt,
    });
  }

  /**
   * Fetch PassTicket
   * @param id 패스 티켓 아이디
   * @returns 패스 티켓 정보
   */

  async findPassTicket({ id }) {
    return this.passTicketsRepository.findOne({ where: { id } });
  }

  /**
   * Delete PassTicket
   * @param id 패스 티켓 아이디
   * @returns true/false
   */

  async deletePassTicket({ id }) {
    const result = await this.passTicketsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
