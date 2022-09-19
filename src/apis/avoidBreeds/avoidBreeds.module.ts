import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvoidBreedsResolver } from './avoidBreeds.resolver';
import { AvoidBreedsService } from './avoidBreeds.service';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AvoidBreed, //
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200', //
    }),
  ],
  providers: [
    AvoidBreedsResolver, //
    AvoidBreedsService,
  ],
})
export class AvoidBreedsModule {}
