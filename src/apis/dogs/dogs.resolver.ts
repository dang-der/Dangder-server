import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { DogsService } from './dogs.service';
import { AroundDogOutput } from './dto/aroundDog.output';
import { CreateDogInput } from './dto/createDog.input';
import { UpdateDogInput } from './dto/updateDog.input';
import { Dog } from './entities/dog.entity';

@Resolver()
export class DogsResolver {
  constructor(
    private readonly dogsService: DogsService, //
  ) {}

  @Query(() => [Dog], { description: ' Return : 모든 강아지 정보' })
  fetchDogs(@Args('page') page: number) {
    return this.dogsService.findAll(page);
  }

  @Query(() => Dog, { description: '한마리의 강아지 정보 조회' })
  async fetchOneDog(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.findOne(id);
  }

  @Query(() => Dog, { description: '유저 정보로 내 강아지 정보 조회' })
  async fetchMyDog(
    @Args('userId', { description: '유저의 uuid' }) userId: string, //
  ) {
    return await this.dogsService.findMyDog(userId);
  }

  @Query(() => [Dog])
  async fetchAroundDogs(
    @Args('id', { description: '강아지 id' }) id: string, //
    @Args('page', { description: '페이지값' }) page: number,
  ) {
    const myDog = await this.fetchOneDog(id);
    const Dogs = await this.fetchDogs(page);
    return await this.dogsService.getAroundDogs({ id, myDog, Dogs });
  }

  @Query(() => [AroundDogOutput])
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
    @Args('createDogInput') createDogInput: CreateDogInput, //
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
    @Args('dogId', { description: '강아지의 uuid' }) dogId: string,
    @Args('dogRegNum', {
      description: '강아지 등록번호, 강아지 등록번호 자체를 업데이트할 때 사용',
      nullable: true,
    })
    dogRegNum: string,
    @Args('ownerBirth', {
      description: '견주의 생년월일, 강아지 등록번호 자체를 업데이트할 때 사용',
      nullable: true,
    })
    ownerBirth: string,
    @Args('updateDogInput')
    updateDogInput: UpdateDogInput,
  ) {
    return this.dogsService.update({
      dogId,
      updateDogInput,
      dogRegNum,
      ownerBirth,
    });
  }

  @Mutation(() => Boolean)
  async deleteDog(
    @Args('id', { description: '강아지의 uuid' }) id: string, //
  ) {
    return this.dogsService.delete({ id });
  }
}
