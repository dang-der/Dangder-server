import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { TodayLikeDogOutput } from './dto/todayLikeDog.output';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}

  async findTodayDog(): Promise<TodayLikeDogOutput[]> {
    const today = new Date();
    const month = today.getUTCMonth() + 1; //months from 1-12
    const day = today.getUTCDate();
    const year = today.getUTCFullYear();

    const a = year + '-' + month + '-' + day; //오늘 날짜만 조회
    console.log(a);

    return await this.likesRepository
      .createQueryBuilder('like')
      .where('like.createdAt = :createdAt', { createdAt: today })
      .select(['like.receiveId AS receiveId', 'like.sendId AS sendId'])
      .limit(12)
      .orderBy('createdAt', 'DESC')
      .getRawMany();
  }

  async isLike({ sendId, receiveId }) {
    const dogFound = await this.dogsRepository.findOne({
      where: { id: receiveId },
      relations: {
        sendId: true,
      },
    });
    let result = false;
    dogFound.sendId.map((el) => {
      if (el.receiveId === sendId) return (result = true);
    });
    return result;
  }

  async create(createLikeInput) {
    const dogFound = await this.dogsRepository.findOne({
      where: { id: createLikeInput.sendId },
      relations: { sendId: true },
    });

    let prevLike = null;
    dogFound.sendId.map((el) => {
      if (el.receiveId === createLikeInput.receiveId) return (prevLike = true);
    });

    if (prevLike === true)
      throw new ConflictException('이미 좋아요 누른 댕댕이입니다!');

    const result = await this.likesRepository.save({
      receiveId: createLikeInput.receiveId,
      sendId: dogFound,
    });

    return result;
  }
}
