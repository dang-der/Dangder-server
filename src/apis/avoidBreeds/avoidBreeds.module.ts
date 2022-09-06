import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvoidBreedsResolver } from './avoidBreeds.resolver';
import { AvoidBreedsService } from './avoidBreeds.service';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AvoidBreed, //
    ]),
  ],
  providers: [
    AvoidBreedsResolver, //
    AvoidBreedsService,
  ],
})
export class AvoidBreedsModule {}
