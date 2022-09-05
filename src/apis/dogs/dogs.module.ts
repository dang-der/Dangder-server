import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from '../characters/entities/character.entity';
import { DogImage } from '../dogsImages/entities/dogimage.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Location } from '../locations/entities/location.entity';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';
import { Dog } from './entities/dog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dog, //
      Interest, //
      Character, //
      DogImage, //
      Location,
    ]),
  ],
  providers: [
    DogsResolver, //
    DogsService, //
  ],
})
export class DogsModule {}
