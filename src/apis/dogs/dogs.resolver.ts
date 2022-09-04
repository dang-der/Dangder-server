import { Req, Res } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
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

  // @Query(() => [Dog])
  // async fetchDogInfo(
  //   @Args('registerNumber') registerNumber: string, //
  //   @Args('name') name: string,
  // ) {
  //   const doginfo = await this.dogsService.getDogInfo({ registerNumber, name });
  //   return doginfo;
  //   // return this.dogsService.findAll();
  // }

  @Mutation(() => Dog)
  async createDog(
    @Args('createDogInput') createDogInput: createDogInput, //
    @Args('registerNumber') registerNumber: string, //
    @Args('name') name: string,
  ) {
    const doginfo = await this.dogsService.getDogInfo({ registerNumber, name });
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
