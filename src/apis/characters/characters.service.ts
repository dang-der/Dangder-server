import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from './entities/character.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
  ) {}

  findAll() {
    return this.charactersRepository.find();
  }

  create(character) {
    return this.charactersRepository.save({
      character,
    });
  }

  async delete({ id }) {
    const result = await this.charactersRepository.softDelete({ id: id });
    return result.affected ? true : false;
  }
}
