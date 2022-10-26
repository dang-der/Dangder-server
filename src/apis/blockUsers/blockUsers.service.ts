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
    private readonly blockUsersRepository: Repository<BlockUser>,
  ) {}

  /**
   * Fetch BlockUsers
   * @returns 조회한 모든 차단 유저 정보
   */
  findAll() {
    return this.blockUsersRepository.find();
  }

  /**
   * Fetch BlockUser
   * @param blockId 차단할 유저 Id
   * @returns 조회한 차단 유저 정보
   */
  async findOne({ blockId }) {
    const findBlockId = await this.blockUsersRepository.findOne({
      where: { blockId },
    });
    return findBlockId;
  }

  /**
   * Create BlockUser
   * @param createBlockUserInput 차단할 유저 정보
   * @param userId 신고한 유저 Id
   * @returns 차단한 유저 정보
   */

  async create({ userId, blockId }) {
    const alreadyBlocked = await this.blockUsersRepository.findOne({
      where: { blockId, user: { id: userId } },
    });
    if (alreadyBlocked) throw new ConflictException('이미 차단된 유저입니다.');

    return this.blockUsersRepository.save({
      user: { id: userId },
      blockId,
      relations: {
        user: true,
      },
    });
  }
}
