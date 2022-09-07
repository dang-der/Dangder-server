import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AvoidBreedsService } from './avoidBreeds.service';
import { createAvoidBreedInput } from './dto/avoidBreed.input';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Resolver()
export class AvoidBreedsResolver {
  constructor(
    private readonly avoidBreedsService: AvoidBreedsService, //
  ) {}

  @Query(() => [AvoidBreed])
  async fetchAvoidBreed() {
    return this.avoidBreedsService.findAll();
  }

  @Mutation(() => [AvoidBreed])
  async createAvoidBreed(
    @Args('createAvoidBreedInput') createAvoidBreedInput: createAvoidBreedInput, //
  ) {
    return this.avoidBreedsService.create(createAvoidBreedInput);
  }
}
