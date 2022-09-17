import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UserOutput } from './dto/userOutput.output';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // 모든 사용자 출력
  @Query(() => [User], { description: 'Return : 전체 유저 정보' })
  fetchUsers() {
    return this.usersService.findAll();
  }

  // Email 값이 일치하는 사용자 출력
  @Query(() => User, { description: 'Return : 유저 정보' })
  async fetchUser(
    @Args('email', { description: '회원의 계정(메일주소)' }) email: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.usersService.findOne({ email });
  }

  // 로그인(userLogin)중인 user 한 사람 조회 API
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => UserOutput, {
    description: 'Return : 로그인한 유저, 유저의 강아지 데이터',
  })
  async fetchLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.findUserAndDog({ email: context.req.user.email });
  }

  // 유저 정보 변경하기

  @Mutation(() => User, { description: 'Return : 바뀐 유저 정보' })
  updateUser(
    @Args('email', { description: '회원의 계정(메일주소)' }) email: string,
    @Args('updateUserInput', { description: '바꾸고 싶은 유저 정보' })
    updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({
      email,
      updateUserInput,
    });
  }

  @Mutation(() => User, { description: 'Return : 가입된 유저 정보' })
  async createUser(
    @Args('createUserInput', { description: '회원의 정보 입력' })
    createUserInput: CreateUserInput, //
  ) {
    // 유저 정보 생성하기
    return this.usersService.create({ createUserInput });
  }

  // 유저 삭제(탈퇴)
  @Mutation(() => Boolean, {
    description: 'Return : deletedAt(유저 정보 삭제된 시간)',
  })
  deleteUser(
    @Args('email', { description: '회원의 계정(메일주소)' }) email: string, //
  ) {
    return this.usersService.delete({ email });
  }
}
