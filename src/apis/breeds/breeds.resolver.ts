import { Query, Resolver } from '@nestjs/graphql';
import { BreedsService } from './breeds.service';
import { Breed } from './entities/breed.entity';

/**
 * Breeds GraphQL API Resolver
 * @APIs `fetchBreeds`
 */
@Resolver()
export class BreedsResolver {
  constructor(
    private readonly breedsService: BreedsService, //
  ) {}

  /**
   * fetchBreeds API
   * [`Query`]
   * @returns 등록된 견종 종류
   */
  @Query(() => Breed, { description: '견종 종류 조회' })
  async fetchBreeds() {
    return this.breedsService.findAll();
  }
}
