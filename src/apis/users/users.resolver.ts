import { Args, Int, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // << 인가 처리를 하기 위해서, 검증을 시도하고 성공하면 아래 로직 실행
  @Query(() => String)
  fetchUser(
    @Context() context: any, //
  ) {
    // 유저 정보 꺼내오기
    console.log(context.req.user);
    console.log('fetchUser 실행 완료!!');
    return 'fetchUser가 실행되었습니다!';
  }
}
