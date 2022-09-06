import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsResolver } from './breeds.resolver';
import { BreedsService } from './breeds.service';
import { Breed } from './entities/breed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Breed, //
    ]),
  ],
  providers: [
    BreedsResolver, //
    BreedsService,
  ],
})
export class BreedsModule {}
