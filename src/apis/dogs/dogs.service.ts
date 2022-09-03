import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { Dog, GENDER_ENUM } from './entities/dog.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,
  ) {}

  async findAll() {
    return this.dogsRepository.find();
  }

  async create({ createDogInput }) {
    return this.dogsRepository.save({
      gender: GENDER_ENUM.FEMALE, //테스트를 위해 임시로 FEMALE로 고정해둠. 추후 변경예정
      ...createDogInput,
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
