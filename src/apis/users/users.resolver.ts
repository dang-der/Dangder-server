import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 모든 사용자 출력
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  // Email 값이 일치하는 사용자 출력

  @Query(() => User)
  fetchUser(
    @Args('email') email: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.usersService.findOne({ email });
  }

  @Mutation(() => User)
  updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    // 유저 정보 변경하기

    return this.usersService.update({
      email,
      updateUserInput,
    });
  }

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    // 유저 정보 생성하기
    return this.usersService.create({ createUserInput });
  }

  // 유저 삭제(탈퇴)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.delete({ email });
  }
}
