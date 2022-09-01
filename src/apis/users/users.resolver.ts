import { Resolver, Query, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Query(() => String)
  fetchUser(
    @Context() context: any, //
  ) {
    // 유저 정보 꺼내오기
    return 'fetchUser가 실행되었습니다!';
  }
}
