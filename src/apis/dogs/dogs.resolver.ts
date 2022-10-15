import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { DogsService } from './dogs.service';
import { AroundDogOutput } from './dto/aroundDog.output';
import { CreateDogInput } from './dto/createDog.input';
import { UpdateDogInput } from './dto/updateDog.input';
import { Dog } from './entities/dog.entity';

/**
 * Dog GraphQL API Resolver
 * @APIs `fetchDogs`, `fetchOneDog`, `fetchMyDog`, `fetchAroundDogs`, `fetchDogsDistance`, `getDogInfo`, `createDog`, `updateDog`, `deleteDog`
 */
@Resolver()
export class DogsResolver {
  constructor(
    private readonly dogsService: DogsService, //
  ) {}

  /**
   * fetchDogs API
   * [`Query`]
   * @param page 조회할 페이지 수
   * @returns 모든 강아지 정보
   */
  @Query(() => [Dog], { description: ' Return : 모든 강아지 정보' })
  fetchDogs(
    @Args('page') page: number, //
  ) {
    return this.dogsService.findAll(page);
  }

  /**
   * fetchOneDog API
   * [`Query`]
   * @param id 강아지의 uuid
   * @returns 한마리의 강아지 정보
   */
  @Query(() => Dog, { description: '한마리의 강아지 정보 조회' })
  async fetchOneDog(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.findOne(id);
  }

  /**
   * fetchMyDog API
   * [`Query`]
   * @param userId 유저의 uuid
   * @returns 한마리의 강아지 정보
   */
  @Query(() => Dog, { description: '유저 정보로 내 강아지 정보 조회' })
  async fetchMyDog(
    @Args('userId', { description: '유저의 uuid' }) userId: string, //
  ) {
    return await this.dogsService.findMyDog(userId);
  }

  /**
   * fetchAroundDogs API
   * [`Query`]
   * @param id 강아지의 uuid
   * @param page 조회할 페이지 수
   * @returns 반경 5km 이내의 강아지 정보
   */
  @Query(() => [Dog])
  async fetchAroundDogs(
    @Args('id', { description: '강아지 id' }) id: string, //
    @Args('page', { description: '페이지값' }) page: number,
  ) {
    const myDog = await this.fetchOneDog(id);
    const Dogs = await this.fetchDogs(page);
    return await this.dogsService.getAroundDogs({ id, myDog, Dogs });
  }

  /**
   * fetchDogsDistance API
   * [`Query`]
   * @param id 강아지의 uuid
   * @returns 상대 강아지와의 거리
   */
  @Query(() => [AroundDogOutput])
  async fetchDogsDistance(
    @Args('id') id: string, //
  ) {
    return await this.dogsService.getDogsDistance({ id });
  }

  /**
   * getDogInfo API
   * [`Mutation`]
   * @param dogRegNum 강아지 등록번호
   * @param ownerBirth 견주의 생년월일
   * @returns 등록번호 유효 여부
   */
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

  /**
   * createDog API
   * [`Mutation`]
   * @param createDogInput 강아지 생성 정보
   * @param dogRegNum 강아지 등록번호
   * @param ownerBirth 견주의 생년월일
   * @returns 생성된 강아지 정보
   */
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

  /**
   * updateDog API
   * [`Mutation`]
   * @param dogId 강아지의 uuid
   * @param dogRegNum 강아지 등록번호
   * @param ownerBirth 견주의 생년월일
   * @param updateDogInput 업데이트할 강아지 정보
   * @returns 업데이트된 강아지 정보
   */
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

  @Mutation(() => Dog)
  async updateTargetDistance(
    @Args('dogId', { description: '강아지의 uuid' }) dogId: string, //
    @Args('targetDistance', { description: '조회할 상대강아지와의 거리' })
    targetDistance: number, //
  ) {
    return this.dogsService.updateTargetDistance({ dogId, targetDistance });
  }

  @Mutation(() => Dog)
  async updateTargetAge(
    @Args('dogId', { description: '강아지의 uuid' }) dogId: string, //
    @Args('targetAgeMin', { description: '조회할 상대강아지의 최소나이' })
    targetAgeMin: number, //
    @Args('targetAgeMax', { description: '조회할 상대강아지의 최대나이' })
    targetAgeMax: number, //
  ) {
    return this.dogsService.updateTargetAge({
      dogId,
      targetAgeMin,
      targetAgeMax,
    });
  }
  /**
   * deleteDog API
   * [`Mutation`]
   * @param id 강아지의 uuid
   * @returns 강아지 삭제 여부
   */
  @Mutation(() => Boolean)
  async deleteDog(
    @Args('id', { description: '강아지의 uuid' }) id: string, //
  ) {
    return this.dogsService.delete({ id });
  }
}
