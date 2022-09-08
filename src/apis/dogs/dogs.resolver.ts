import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { DistanceType } from '../distancesType/entities/distanceType.entity';
import { DogsService } from './dogs.service';
import { createDogInput } from './dto/createDog.input';
import { UpdateDogInput } from './dto/updateDog.input';
import { Dog } from './entities/dog.entity';

@Resolver()
export class DogsResolver {
  constructor(
    private readonly dogsService: DogsService, //
  ) {}

  @Query(() => [Dog])
  fetchDogs() {
    return this.dogsService.findAll();
  }

  @Query(() => Dog)
  async fetchMyDog(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.findOne(id);
  }

  @Query(() => [Dog])
  async fetchAroundDogs(
    @Args('id') id: string, //
  ) {
    const myDog = await this.fetchMyDog(id);
    const Dogs = await this.fetchDogs();
    return await this.dogsService.getAroundDogs({ id, myDog, Dogs });
  }

  @Query(() => [DistanceType])
  async fetchDogsDistance(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.getDogsDistance({ id });
  }

  @Mutation(() => Boolean)
  async getdoginfo(
    @Args('registerNumber') registerNumber: string,
    @Args('birth') birth: string,
  ) {
    const doginfo = await this.dogsService.getDogInfo({
      registerNumber,
      birth,
    });
    return doginfo ? true : false;
  }

  @Mutation(() => Dog)
  async createDog(
    @Args('createDogInput') createDogInput: createDogInput, //
    @Args('registerNumber') registerNumber: string, //
    @Args('birth') birth: string,
  ) {
    const doginfo = await this.dogsService.getDogInfo({
      registerNumber,
      birth,
    });
    return this.dogsService.create({ doginfo, createDogInput });
  }

  @Mutation(() => Dog)
  async updateDog(
    @Args('id') id: string,
    @Args('updateDogInput') updatedogInput: UpdateDogInput,
  ) {
    return this.dogsService.update({ id, updatedogInput });
  }

  @Mutation(() => Boolean)
  async deleteDog(
    @Args('id') id: string, //
  ) {
    return this.dogsService.delete({ id });
  }
}
