import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { DogImage } from './entities/dogimage.entity';

@Injectable()
export class DogsImagesService {
  constructor(
    @InjectRepository(DogImage)
    private readonly dogsimagesRepository: Repository<DogImage>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}

  async findOne({ dogId }) {
    const result = await this.dogsimagesRepository.find({
      where: { dog: { id: dogId } },
      relations: {
        dog: true,
      },
    });
    return result;
  }

  async findMainImage({ dogId }) {
    const result = await this.dogsimagesRepository.find({
      where: { dog: { id: dogId }, isMain: true },
      relations: {
        dog: true,
      },
    });

    return result;
  }
}
