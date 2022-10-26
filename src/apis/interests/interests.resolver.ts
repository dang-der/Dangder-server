import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InterestChatRoomsService } from '../interestChatRooms/interestChatRooms.service';
import { CreateInterestInput } from './dto/createInterest.input';
import { InterestCategoryOutput } from './dto/interestCategory.output';
import { Interest } from './entities/interest.entity';
import { InterestsService } from './interests.service';

/**
 * Interest GraphQL API Resolver
 * @APIs `fetchInterests`, `createInterest`, `deleteInterest`
 */
@Resolver()
export class InterestsResolver {
  constructor(
    private readonly interestsService: InterestsService, //

    private readonly interestChatRoomsService: InterestChatRoomsService,
  ) {}

  /**
   * fetchInterests API
   * [`Query`]
   * @returns 등록된 모든 관심사 정보
   */
  @Query(() => [InterestCategoryOutput])
  async fetchInterestCategory() {
    return this.interestsService.findAll();
  }

  /**
   * createInterest API
   * [`Mutation`]
   * @param character 등록할 관심사
   * @returns 등록한 관심사 정보
   */
  @Mutation(() => Interest, { description: '관심사 항목 생성' })
  async createInterest(
    @Args('createInterestInput') createInterestInput: CreateInterestInput,
  ) {
    const result = await this.interestsService.create(createInterestInput); //
    // 관심사 생성 시, 관심사와 1:1로 연결된 관심사 채팅방 생성
    await this.interestChatRoomsService.create({ interest: result });
    return result;
  }

  /**
   * deleteInterest API
   * [`Mutation`]
   * @param id 관심사 uuid
   * @returns 관심사 정보 삭제 여부
   */
  @Mutation(() => Boolean)
  deleteInterest(
    @Args('id', { description: '관심사 uuid' }) id: string, //
  ) {
    return this.interestsService.delete({ id });
  }
}
