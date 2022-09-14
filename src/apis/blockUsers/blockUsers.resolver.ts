import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlockUsersService } from './blockUsers.service';
import { CreateBlockUserInput } from './dto/createBlockUser.input';
import { BlockUser } from './entities/blockUser.entity';

@Resolver()
export class BlockUserResolver {
  constructor(
    private readonly blockUsersService: BlockUsersService, //
  ) {}

  // 모든 차단된 유저 출력

  @Query(() => [BlockUser], { description: 'Return : 차단된 모든 유저 정보' })
  fetchBlockUsers() {
    return this.blockUsersService.findAll();
  }

  // blockId 값이 일치하는 사용자 출력

  @Query(() => BlockUser, { description: 'Return : 차단된 유저 정보' })
  fetchBlockUser(
    @Args('blockId', { description: '차단된 유저 Id' }) blockId: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.blockUsersService.findOne({ blockId });
  }

  @Mutation(() => BlockUser, { description: 'Return : 차단된 유저 정보' })
  createBlockUser(
    @Args('createBlockUserInput', { description: '차단할 유저 정보' })
    createBlockUserInput: CreateBlockUserInput, //
  ) {
    // 차단될 유저 정보 생성하기
    return this.blockUsersService.create({ createBlockUserInput });
  }
}
