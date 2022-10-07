import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Breed } from './entities/breed.entity';

/**
 * Breeds Service
 */
@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) {}

  /**
   * 등록된 견종 종류
   * @returns 등록된 모든 견종 종류
   */
  findAll() {
    return this.breedsRepository.find();
  }
}
