import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

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
    // bcrypt 사용하기
    // hash 알고리즘을 사용해 비밀번호를 암호화하는데 hash 메서드의 두 번째 인자는 salt이다.
    // 원본 password를 salt 시켜 준다.

    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      3.141592,
    );
    console.log(hashedPassword);

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
