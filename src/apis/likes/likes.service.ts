import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}

  async isLike({ sendId, receivedId }) {
    const dogFound = await this.dogsRepository.findOne({
      where: { id: receivedId },
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
      if (el.receiveId === createLikeInput.receivedId) prevLike = true;
    });

    if (prevLike === true)
      throw new ConflictException('이미 좋아요 누른 댕댕이입니다!');

    const result = await this.likesRepository.save({
      receiveId: createLikeInput.receivedId,
      sendId: dogFound,
    });
    return result;
  }
}
