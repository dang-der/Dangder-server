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

  @Query(() => [BlockUser])
  fetchBlockUsers() {
    return this.blockUsersService.findAll();
  }

  // Blockid 값이 일치하는 사용자 출력

  @Query(() => BlockUser)
  fetchBlockUser(
    @Args('blockId') blockId: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.blockUsersService.findOne({ blockId });
  }

  @Mutation(() => BlockUser)
  createBlockUser(
    @Args('createBlockUserInput') createBlockUserInput: CreateBlockUserInput, //
  ) {
    // 차단될 유저 정보 생성하기
    return this.blockUsersService.create({ createBlockUserInput });
  }
}
