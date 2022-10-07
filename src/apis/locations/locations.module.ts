import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { Location } from './entities/location.entity';
import { LocationsResolver } from './locations.resolver';
import { LocationsService } from './locations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Location, //
      Dog,
    ]),
  ],
  providers: [
    LocationsResolver, //
    LocationsService,
  ],
})
export class LocationsModule {}
