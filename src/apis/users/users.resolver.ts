import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { UserOutput } from './dto/userOutput.output';
import { Cache } from 'cache-manager';
import { UserElasticsearchOutPut } from './dto/userElasticsearch.output';

/**
 * User GraphQL API Resolver
 * @APIs `fetchUsers`, `fetchUser`, `fetchLoginUser`, `fetchLoginUserIsCert`, `updateUser`, `createUser`, `deleteUser`
 */
@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Fetch User By Search API
   * @param search
   * @returns 검색된 유저 정보
   */

  @Query(() => [UserElasticsearchOutPut], { description: '유저 검색' })
  fetchUsersBySearch(@Args({ name: 'search', nullable: true }) search: string) {
    return this.usersService.search({ search });
  }

  /**
   * AllUser Fetch API
   * @type [`Query`]
   * @returns 전체 유저 정보
   */
  @Query(() => [User], { description: 'Return : 전체 유저 정보' })
  async fetchUsers(
    @Args('page') page: number, //
  ) {
    return this.usersService.findAll(page);
  }

  /**
   * User Fetch API
   * @type [`Query`]
   * @param email
   * @returns 유저 정보
   */
  @Query(() => User, { description: 'Return : 유저 정보' })
  async fetchUser(
    @Args('email', { description: '회원의 계정(메일주소)' }) email: string, //
  ) {
    // 유저 정보 꺼내오기
    return this.usersService.findOne({ email });
  }

  /**
   * LoginUser Fetch API
   * @type [`Query`]
   * @param context 로그인한 유저의 정보
   * @returns 로그인한 유저, 유저의 강아지 데이터
   */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => UserOutput, {
    description: 'Return : 로그인한 유저, 유저의 강아지 데이터',
  })
  async fetchLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.findUserAndDog({ email: context.req.user.email });
  }

  /**
   * LoginUser Fetch API - User Info Only
   * @type [`Query`]
   * @param context 로그인한 유저의 정보
   * @returns 로그인한 유저 데이터
   */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User, {
    description: 'Return : 로그인한 유저 데이터',
  })
  async fetchSocialLoginUser(
    @Context() context: any, //
  ) {
    return this.usersService.findOne({ email: context.req.user.email });
  }

  /**
   * LoginUser IsCert Fetch API
   * @type [`Query`]
   * @param context 로그인한 유저의 정보
   * @returns 로그인 중인 유저의 이용권 유효 여부 확인하기
   */
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Boolean, {
    description: '로그인 중인 유저의 이용권 유효 여부 확인하기',
  })
  async fetchLoginUserIsCert(
    @Context() context: any, //
  ) {
    const result = await this.cacheManager.get(
      `${context.req.user.email}:cert`,
    );
    return result ? true : false;
  }

  /**
   * User Update API
   * @type [`Mutation`]
   * @param email 회원의 계정(메일 주소)
   * @param updateUserInput 바꾸고 싶은 유저 정보
   * @returns 바뀐 유저 정보
   */
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

  /**
   * User Create API
   * @type [`Mutation`]
   * @param createUserInput 회원 정보
   * @returns 가입된 유저 정보
   */
  @Mutation(() => User, { description: 'Return : 가입된 유저 정보' })
  async createUser(
    @Args('createUserInput', { description: '회원의 정보 입력' })
    createUserInput: CreateUserInput, //
  ) {
    return this.usersService.create({ createUserInput });
  }

  /**
   * User Delete API
   * @type [`Mutation`]
   * @param email 회원의 계정(메일주소)
   * @returns 유저 정보가 삭제된 시간
   */
  @Mutation(() => Boolean, {
    description: 'Return : deletedAt(유저 정보 삭제된 시간)',
  })
  deleteUser(
    @Args('email', { description: '회원의 계정(메일주소)' }) email: string, //
  ) {
    return this.usersService.delete({ email });
  }

  /**
   * @type [`Mutation`]
   * @param id 유저 id
   * @returns 유저 정보
   */
  @Mutation(() => User, {
    description: 'Return : 유저 정보',
  })
  stopUser(
    @Args('id', { description: '유저 id' }) id: string, //
  ) {
    return this.usersService.stopUser({ id });
  }
}
