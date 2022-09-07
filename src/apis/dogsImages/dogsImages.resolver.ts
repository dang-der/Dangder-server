import { Args, Query, Resolver } from '@nestjs/graphql';
import { DogsImagesService } from './dogsImages.service';
import { DogImage } from './entities/dogimage.entity';

@Resolver()
export class DogsImagesResolver {
  constructor(
    private readonly dogsImagesService: DogsImagesService, //
  ) {}

  @Query(() => [DogImage])
  async fetchDogImage(
    @Args('dogId') dogId: string, //
  ) {
    return await this.dogsImagesService.findOne({ dogId });
  }

  @Query(() => [DogImage])
  async fetchMainDogImage(
    @Args('dogId') dogId: string, //
  ) {
    return await this.dogsImagesService.findMainImage({ dogId });
  }
}
