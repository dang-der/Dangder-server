import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Injectable()
export class AvoidBreedsService {
  constructor(
    @InjectRepository(AvoidBreed)
    private readonly avoidBreedsRepository: Repository<AvoidBreed>,
  ) {}

  findAll() {
    return this.avoidBreedsRepository.find();
  }

  async create(createAvoidBreedInput) {
    const { avoidBreed } = createAvoidBreedInput;

    const createAvoidBreeds = await Promise.all(
      avoidBreed.map(
        (el) =>
          new Promise(async (resolve, reject) => {
            try {
              const newAvoidBreed = await this.avoidBreedsRepository.save({
                avoidBreed: el,
              });
              resolve(newAvoidBreed);
            } catch (err) {
              reject(err);
            }
          }),
      ),
    );
    return createAvoidBreeds;
  }
}
