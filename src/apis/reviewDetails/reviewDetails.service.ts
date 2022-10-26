import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewDetail } from './entities/reviewDetail.entity';

@Injectable()
export class ReivewDetailsService {
  constructor(
    @InjectRepository(ReviewDetail)
    private readonly reviewDetailsRepository: Repository<ReviewDetail>,
  ) {}

  async findAll() {
    return await this.reviewDetailsRepository.find();
  }

  create(reviewDetail) {
    return this.reviewDetailsRepository.save({
      reviewDetail,
    });
  }

  async delete(id) {
    const result = await this.reviewDetailsRepository.softDelete(id);
    return result.affected ? true : false;
  }
}
