import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';

/**
 * Characters Service
 */
@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
  ) {}

  /**
   * 등록된 모든 성격 정보 조회
   * @returns 등록된 모든 성격 종류
   */
  findAll() {
    return this.charactersRepository.find();
  }

  /**
   * 성격 유형 등록
   * @param character 성격 정보
   * @returns 생성된 성격 정보
   */
  create(character) {
    return this.charactersRepository.save({
      character,
    });
  }

  /**
   * 등록된 성격 유형 삭제
   * @param id 성격 uuid
   * @returns 성격 정보 삭제 여부
   */
  async delete({ id }) {
    const result = await this.charactersRepository.softDelete({ id: id });
    return result.affected ? true : false;
  }
}
