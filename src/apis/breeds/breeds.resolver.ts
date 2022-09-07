import { Query, Resolver } from '@nestjs/graphql';
import { BreedsService } from './breeds.service';
import { Breed } from './entities/breed.entity';

@Resolver()
export class BreedsResolver {
  constructor(
    private readonly breedsService: BreedsService, //
  ) {}

  @Query(() => Breed)
  async fetchBreeds() {
    return this.breedsService.findAll();
  }
}
