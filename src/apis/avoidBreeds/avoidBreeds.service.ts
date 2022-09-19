import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Injectable()
export class AvoidBreedsService {
  constructor(
    @InjectRepository(AvoidBreed)
    private readonly avoidBreedsRepository: Repository<AvoidBreed>,

    private readonly elasticsearchService: ElasticsearchService, //
  ) {}

  async searchAll({ search }) {
    const searchResult = await this.elasticsearchService.search({
      index: 'search-avoid-breed',
      query: {
        match: { avoidbreed: search },
      },
    });
    console.log(JSON.stringify(searchResult, null, '  '));

    const result = searchResult.hits.hits.map((el: any) => ({
      id: el._source.id,
      avoidBreed: el._source.avoidbreed,
    }));
    console.log(result);
    return result;
  }

  findAll() {
    return this.avoidBreedsRepository.find();
  }

  async create(createAvoidBreedInput) {
    const { avoidBreed } = createAvoidBreedInput;

    const createAvoidBreeds = await Promise.all(
      avoidBreed.map(
        (el) =>
          new Promise(async (resolve, reject) => {
            try {
              const newAvoidBreed = await this.avoidBreedsRepository.save({
                avoidBreed: el,
              });
              resolve(newAvoidBreed);
            } catch (err) {
              reject(err);
            }
          }),
      ),
    );
    return createAvoidBreeds;
  }
}
