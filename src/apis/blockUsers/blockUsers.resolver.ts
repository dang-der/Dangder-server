import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockUsersService } from './blockUsers.service';
import { CreateBlockUserInput } from './dto/createBlockUser.input';
import { BlockUser } from './entities/blockUser.entity';

/**
 * BlockUser GraphQL API Resolver
 * @APIs `fetchBlockUsers`, `fetchBlockUser`, `createBlockUser`
 */
@Resolver()
export class BlockUserResolver {
  constructor(
    private readonly blockUsersService: BlockUsersService, //
  ) {}

  /**
   * BlockUsers Fetch API
   * @type [`Query`]
   * @returns 차단된 모든 유저 정보
   */

  @Query(() => [BlockUser], { description: 'Return : 차단된 모든 유저 정보' })
  fetchBlockUsers() {
    return this.blockUsersService.findAll();
  }

  /**
   * BlockUser Fetch API
   * @type [`Query`]
   * @param blockId 차단된 유저 Id
   * @returns 차단된 유저 정보
   */

  @Query(() => BlockUser, { description: 'Return : 차단된 유저 정보' })
  fetchBlockUser(
    @Args('blockId', { description: '차단된 유저 Id' }) blockId: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.blockUsersService.findOne({ blockId });
  }

  /**
   * BlockUser check API
   * @type [`Mutation`]
   * @param userId 피해자 Id
   * @param blockId 차단된 유저 Id
   * @returns
   */

  @Mutation(() => Boolean, {
    description: 'return : 이미 차단되었는지 확인',
  })
  async alreadyBlocked(
    @Args('userId', { description: '피해자 Id' }) userId: string,
    @Args('blockId', { description: '차단된 유저 Id' }) blockId: string,
  ) {
    return this.blockUsersService.alreadyBlock({ userId, blockId });
  }
  /**
   * BlockUser Create API
   * @type [`Mutation`]
   * @param createBlockUserInput 차단할 유저 정보
   * @returns 차단된 유저 정보
   */
  @Mutation(() => BlockUser, { description: 'Return : 차단된 유저 정보' })
  createBlockUser(
    @Args('createBlockUserInput', { description: '차단할 유저 정보' })
    createBlockUserInput: CreateBlockUserInput, //
  ) {
    // 차단될 유저 정보 생성하기
    return this.blockUsersService.create({ createBlockUserInput });
  }
}
