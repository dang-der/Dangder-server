import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog, GENDER_ENUM } from './entities/dog.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}

  findAll() {
    return this.dogsRepository.find({});
  }

  async create({ createDogInput }) {
    return this.dogsRepository.save({
      ...createDogInput,
      gender: GENDER_ENUM.FEMALE,
    });
  }

  async update({ id, updatedogInput }) {
    const dog = await this.dogsRepository.findOne({
      where: { id: id },
    });

    const result = this.dogsRepository.save({
      ...dog,
      id: id,
      ...updatedogInput,
    });
    return result;
  }

  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id: id });
    return result.affected ? true : false;
  }
}
