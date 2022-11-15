import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockUsersService } from './blockUsers.service';
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
  fetchBlockUsers(
    @Args('page') page: number, //
  ) {
    return this.blockUsersService.fetchBlockUsers(page);
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
   * BlockUser Create API   기존의 BlockUser API
   * @type [`Mutation`]
   * @param createBlockUserInput 차단할 유저 정보
   * @returns 차단된 유저 정보
   */
  // @Mutation(() => BlockUser, { description: 'Return : 차단된 유저 정보' })
  // createBlockUser(
  //   @Args('createBlockUserInput', { description: '차단할 유저 정보' })
  //   createBlockUserInput: CreateBlockUserInput, //
  //   @Args('userId', { description: '신고한 유저 Id' }) userId: string,
  // ) {
  //   // 차단될 유저 정보 생성하기
  //   return this.blockUsersService.create({ createBlockUserInput, userId });
  // }

  /** BlockUser Create API
   * @type [`Mutation`]
   * @param userId 차단을 요청한 유저 Id
   * @param blockId 차단하고 싶은 유저 Id
   * @returns 차단된 유저 정보
   */

  @Mutation(() => BlockUser, { description: 'Return: 차단된 유저 정보' })
  createBlockUser(
    @Args('userId', { description: '차단을 요청한 유저 Id' }) userId: string,
    @Args('blockId', { description: '차단하고 싶은 유저 Id' }) blockId: string,
  ) {
    return this.blockUsersService.create({ userId, blockId });
  }
}
