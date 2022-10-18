import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { BlockUser } from './entities/blockUser.entity';

/**
 * BlockUser Service
 */
@Injectable()
export class BlockUsersService {
  constructor(
    @InjectRepository(BlockUser)
    private readonly blockUsersRepository: Repository<BlockUser>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
  findOne({ blockId }) {
    return this.blockUsersRepository.findOne({ where: { blockId } });
  }

  /**
   * Create BlockUser
   * @param createBlockUserInput 차단할 유저 정보
   * @returns 차단한 유저 정보
   */
  async create({ createBlockUserInput }) {
    const user = await this.blockUsersRepository.findOne({
      where: { blockId: createBlockUserInput.blockId },
    });
    if (user) throw new ConflictException('이미 차단된 유저입니다.');

    return this.blockUsersRepository.save({ ...createBlockUserInput });
  }

  /**
   * Check BlockUser
   * @param userId 피해자 Id
   * @param blockId 차단된 유저 Id
   * @returns true/false
   */
  async alreadyBlock({ userId, blockId }) {
    const userFound = await this.usersRepository.findOne({
      where: { id: blockId },
      relations: {
        userId: true,
      },
    });
    let result = false;
    userFound.userId.map((el) => {
      if (el.blockId === userId) return (result = true);
    });
    return result;
  }
}
