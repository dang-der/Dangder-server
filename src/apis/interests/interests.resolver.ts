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

  @Mutation(() => Interest)
  async createInterest(
    @Args('interest') interest: string, //
  ) {
    return this.interestsService.create(interest); //
  }

  @Mutation(() => Boolean)
  deleteInterest(
    @Args('id') id: string, //
  ) {
    return this.interestsService.delete({ id });
  }
}
