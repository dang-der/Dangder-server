import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async update({ id, lat, lng }) {
    const location = await this.locationsRepository.findOne({ where: { id } });

    return await this.locationsRepository.save({
      ...location,
      lat,
      lng,
    });
  }
}
