import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockUser } from './entities/blockUser.entity';

/**
 * BlockUser Service
 */
@Injectable()
export class BlockUsersService {
  constructor(
    @InjectRepository(BlockUser)
    private readonly blockusersRepository: Repository<BlockUser>,
  ) {}

  /**
   * Fetch BlockUsers
   * @returns 조회한 모든 차단 유저 정보
   */
  findAll() {
    return this.blockusersRepository.find();
  }

  /**
   * Fetch BlockUser
   * @param blockId 차단할 유저 Id
   * @returns 조회한 차단 유저 정보
   */
  findOne({ blockId }) {
    return this.blockusersRepository.findOne({ where: { blockId } });
  }

  /**
   * Create BlockUser
   * @param createBlockUserInput 차단할 유저 정보
   * @returns 차단한 유저 정보
   */
  async create({ createBlockUserInput }) {
    const user = await this.blockusersRepository.findOne({
      where: { blockId: createBlockUserInput.blockId },
    });
    if (user) throw new ConflictException('이미 차단된 유저입니다.');

    return this.blockusersRepository.save({ ...createBlockUserInput });
  }
}
