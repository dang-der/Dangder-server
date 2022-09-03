import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) {}

  findAll() {
    return this.interestsRepository.find();
  }

  create(interest) {
    return this.interestsRepository.save({
      interest: interest,
    });
  }

  async delete({ id }) {
    const result = await this.interestsRepository.softDelete({ id: id });
    return result.affected ? true : false;
  }
}
