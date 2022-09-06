import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AvoidBreedsService } from './avoidBreeds.service';
import { createAvoidBreedInput } from './dto/avoidBreed.input';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Resolver()
export class AvoidBreedsResolver {
  constructor(
    private readonly avoidBreedsService: AvoidBreedsService, //
  ) {}
  @Mutation(() => [AvoidBreed])
  async createAvoidBreed(
    @Args('createAvoidBreedInput') createAvoidBreedInput: createAvoidBreedInput, //
  ) {
    return this.avoidBreedsService.create(createAvoidBreedInput);
  }
}
