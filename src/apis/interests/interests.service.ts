import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';

/**
 * Interests Service
 */
@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) {}

  /**
   * 등록된 모든 관심사 정보 조회
   * @returns 등록된 모든 관심사 종류
   */
  findAll() {
    return this.interestsRepository.find();
  }

  /**
   * 관심사 유형 등록
   * @param character 관심사 정보
   * @returns 생성된 관심사 정보
   */
  create(interest) {
    return this.interestsRepository.save({
      interest: interest,
    });
  }

  /**
   * 등록된 관심사 유형 삭제
   * @param id 관심사 uuid
   * @returns 관심사 정보 삭제 여부
   */
  async delete({ id }) {
    const result = await this.interestsRepository.softDelete({ id: id });
    return result.affected ? true : false;
  }
}
