import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DogImage } from './entities/dogimage.entity';

export class DogsImagesService {
  constructor(
    @InjectRepository(DogImage)
    private readonly dogsimagesRepository: Repository<DogImage>,
  ) {}

  async create({ img, dogId }) {
    const waitedFiles = await Promise.all(img);
    const results = await Promise.all(
      waitedFiles.map((el, idx) => {
        //첫번째 사진은 메인, 나머지는 서브로 등록
        const ismain = idx === 0 ? true : false;
        return new Promise((resolve) => {
          const result = this.dogsimagesRepository.save({
            img: el,
            isMain: ismain,
            dogId,
          });
          resolve(result);
        });
      }),
    );
    return results;
  }
}
