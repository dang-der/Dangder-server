import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterestCategoryOutput } from './dto/interestCategory.output';
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
  async findAll() {
    const result = await this.interestsRepository.find({
      relations: { iChatRoom: true },
    });
    const category = [];
    for (let i = 0; i < result.length; i++) {
      const tmp = new InterestCategoryOutput();
      tmp.interest = result[i].interest;
      tmp.interestImg = result[i].interestImg;
      tmp.title = result[i].title;
      tmp.subTitle = result[i].subTitle;
      tmp.iChatRoomId = result[i].iChatRoom.id;
      category.push(tmp);
    }

    return category;
  }

  /**
   * 관심사 유형 등록
   * @param character 관심사 정보
   * @returns 생성된 관심사 정보
   */
  create(createInterestInput) {
    return this.interestsRepository.save({
      ...createInterestInput,
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
