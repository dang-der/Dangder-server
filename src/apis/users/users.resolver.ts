import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';

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
  async fetchUser(
    @Args('email') email: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.usersService.findOne({ email });
  }

  // 로그인(userLogin)중인 user 한 사람 조회 API
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.findOne({ email: context.req.user.email });
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
  async createUser(
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
