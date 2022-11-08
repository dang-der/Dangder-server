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
  findAll(page: number) {
    return this.blockUsersRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      relations: { user: true },
    });
  }

  /**
   * Fetch BlockUser
   * @param blockId 차단할 유저 Id
   * @returns 조회한 차단 유저 정보
   */
  async findOne({ blockId }) {
    const findBlockId = await this.blockUsersRepository.findOne({
      where: { blockId },
      relations: { user: true },
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
