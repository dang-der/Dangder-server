import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { DogsImagesResolver } from './dogsImages.resolver';
import { DogsImagesService } from './dogsImages.service';
import { DogImage } from './entities/dogImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DogImage, //
      Dog, //
    ]),
  ],
  providers: [
    DogsImagesResolver, //
    DogsImagesService,
  ],
})
export class DogsImagesModule {}
