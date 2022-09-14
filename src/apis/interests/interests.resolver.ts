import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Interest } from './entities/interest.entity';
import { InterestsService } from './interests.service';

@Resolver()
export class InterestsResolver {
  constructor(
    private readonly interestsService: InterestsService, //
  ) {}

  @Query(() => [Interest])
  async fetchInterests() {
    return this.interestsService.findAll();
  }

  @Mutation(() => Interest, { description: '관심사 항목 생성' })
  async createInterest(
    @Args('interest', { description: '관심사 내용' }) interest: string, //
  ) {
    return this.interestsService.create(interest); //
  }

  @Mutation(() => Boolean)
  deleteInterest(
    @Args('id', { description: '관심사 uuid' }) id: string, //
  ) {
    return this.interestsService.delete({ id });
  }
}
