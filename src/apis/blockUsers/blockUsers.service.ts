import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockUser } from './entities/blockUser.entity';

@Injectable()
export class BlockUsersService {
  constructor(
    @InjectRepository(BlockUser)
    private readonly blockusersRepository: Repository<BlockUser>,
  ) {}

  // 차단된 유저 전체 찾기
  findAll() {
    return this.blockusersRepository.find();
  }

  // 차단된 유저 blockId로 찾기
  findOne({ blockId }) {
    return this.blockusersRepository.findOne({ where: { blockId } });
  }

  async create({ createBlockUserInput }) {
    const user = await this.blockusersRepository.findOne({
      where: { blockId: createBlockUserInput.blockId },
    });
    if (user) throw new ConflictException('이미 차단된 유저입니다.');

    return this.blockusersRepository.save({ ...createBlockUserInput });
  }
}
