import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
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
    console.log(myDog);
    const Dogs = await this.fetchDogs();
    return await this.dogsService.getAroundDogs({ myDog, Dogs });
  }

  @Mutation(() => Int)
  async getDogsDistance(
    @Args('myDogId') myDogId: string, //
    @Args('targetDogId') targetDogId: string,
  ) {}

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
  // 추후 유저의id로 변경예정
  async deleteDog(@Args('id') id: string) {
    return this.dogsService.delete({ id });
  }
}
