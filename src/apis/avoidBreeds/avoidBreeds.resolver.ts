import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AvoidBreedsService } from './avoidBreeds.service';
import { CreateAvoidBreedsInput } from './dto/avoidBreed.input';
import { AvoidBreed } from './entities/avoidBreed.entity';

@Resolver()
export class AvoidBreedsResolver {
  constructor(
    private readonly avoidBreedsService: AvoidBreedsService, //
  ) {}

  @Query(() => [AvoidBreed], { description: '기피 견종 목록 조회' })
  async fetchAvoidBreeds() {
    return this.avoidBreedsService.findAll();
  }

  @Mutation(() => [AvoidBreed], { description: '기피견종 목록 추가' })
  async createAvoidBreeds(
    @Args('CreateAvoidBreedsInput')
    CreateAvoidBreedsInput: CreateAvoidBreedsInput, //
  ) {
    return this.avoidBreedsService.create(CreateAvoidBreedsInput);
  }
}
