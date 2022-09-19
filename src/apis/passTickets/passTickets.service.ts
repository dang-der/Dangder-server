import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassTicket } from './entities/passTicket.entity';

@Injectable()
export class PassTicketsService {
  constructor(
    @InjectRepository(PassTicket)
    private readonly passTicketsRepository: Repository<PassTicket>,
  ) {}

  // passTicket 생성

  async create({ PassTicket }) {
    return this.passTicketsRepository.save({ ...PassTicket });
  }

  // passTicket Id로 조회

  async findPassTicket({ id }) {
    return this.passTicketsRepository.findOne({ where: { id } });
  }

  // passTicket softdelete

  async deletePassTicket({ id }) {
    const result = await this.passTicketsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}