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
  async fetchOneDog(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.findOne(id);
  }

  @Query(() => [Dog])
  async fetchAroundDogs(
    @Args('id') id: string, //
  ) {
    const myDog = await this.fetchOneDog(id);
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
  async getDogInfo(
    @Args('dogRegNum') dogRegNum: string,
    @Args('ownerBirth') ownerBirth: string,
  ) {
    const dogInfo = await this.dogsService.getDogInfo({
      dogRegNum,
      ownerBirth,
    });
    return dogInfo ? true : false;
  }

  @Mutation(() => Dog)
  async createDog(
    @Args('createDogInput') createDogInput: createDogInput, //
    @Args('dogRegNum') dogRegNum: string, //
    @Args('ownerBirth') ownerBirth: string,
  ) {
    const dogInfo = await this.dogsService.getDogInfo({
      dogRegNum,
      ownerBirth,
    });
    return this.dogsService.create({ dogInfo, createDogInput });
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
