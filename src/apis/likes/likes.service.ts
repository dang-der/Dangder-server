import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { resolve } from 'path/posix';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { DogsImagesService } from '../dogsImages/dogsImages.service';

import { TodayLikeDogOutput } from './dto/todayLikeDog.output';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    private readonly dogImagesService: DogsImagesService, //
  ) {}

  async findTodayDog() {
    const today = new Date();
    const month = today.getMonth() + 1; //months from 1-12
    const day = today.getDate();
    const year = today.getFullYear();

    const a = year + '-' + month + '-' + day; //오늘 날짜만 조회

    const result = await this.likesRepository.find({
      where: { createdAt: a },
    });

    const map = new Map();

    result.forEach((e) => {
      let count = 0;
      if (map.get(e.receiveId) === undefined) map.set(e.receiveId, 1);
      else count = map.get(e.receiveId);
      map.set(e.receiveId, count + 1);
    });
    let top = [...map];

    top.sort((a, b) => b[1] - a[1]); //2번째 인덱스 값이 좋아요 받은 갯수이므로 이를 기준으로 정렬
    top = top.slice(0, 6); // 12마리까지만 받아오기

    const topDogInfo = [];
    for (let i = 0; i < top.length; i++) {
      const topOneDogInfo = await this.dogsRepository.findOne({
        where: { id: top[i][0] },
        relations: { img: true },
      });
      const topMainImg = await this.dogImagesService.findMainImage({
        dogId: top[i][0],
      });
      const tmp = new TodayLikeDogOutput();
      (tmp.age = topOneDogInfo.age), //
        (tmp.id = topOneDogInfo.id), //
        (tmp.name = topOneDogInfo.name), //
        (tmp.mainImg = topMainImg[0].img);
      topDogInfo.push(tmp);
    }
    return topDogInfo;
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
    const today = new Date();
    const month = today.getMonth() + 1; //months from 1-12
    const day = today.getDate();
    const year = today.getFullYear();

    const todayDate = year + '-' + month + '-' + day; //오늘 날짜만 조회

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
      createdAt: todayDate,
    });

    return result;
  }
}
