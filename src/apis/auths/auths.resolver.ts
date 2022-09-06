import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthsService } from './auths.service';
import { UsersService } from '../users/users.service';
import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/commons/type/context';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authsService: AuthsService, //
    // redis 사용을 위한 cacheManager 선언
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async userLogin(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() Context: IContext,
  ) {
    // 1. 로그인. (입력받은 email 계정정보 불러오기)
    const user = await this.usersService.findOne({ email });

    // 2. 결과값이 없을 시, 오류메시지 전송
    if (!user)
      throw new UnprocessableEntityException(
        '입력하신 계졍(이메일)의 가입내역이 없습니다.',
      );

    // 3. 입력받은 비밀번호가 계정의 비밀번호가 다를 때, 오류메시지 전송
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth)
      throw new UnprocessableEntityException(
        '비밀번호가 일치하지 않습니다. 로그인 할 수 없습니다.',
      );

    // 4. refreashToken ( -> JWT )을 만들어서, 프론트엔드 브라우저 쿠키에 저장하여 보내주기.
    this.authsService.setRefreshToken({ user, res: Context.res });

    // 5. 입력받은 계정과 비밀번호가 일치할 때
    //    => accessToken( -> JWT ) 생성하여 브라우저에 전달하기.
    return this.authsService.getAccessToken({ user });
  }

  // Refresh Token (on cookie) 을 통해 AccessToken을 재발급
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    return this.authsService.getAccessToken({ user: context.req.user });
  }

  // LogOut
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: IContext, //
  ) {
    // 유저의 accessToken, refreshToken 추출
    let accessToken = context.req.headers.authorization;
    accessToken = accessToken.replace('Bearer ', '');
    let refreshToken = context.req.headers.cookie;
    refreshToken = refreshToken.replace('refreshToken=', '');

    // jsonwebtoken 을 이용한 토큰 검증
    const { validAccessToken, validRefreshToken } =
      this.authsService.verifyTokens({
        accessToken,
        refreshToken,
      });

    // logout 을 실행한 순간의 시간
    const now = new Date().getTime();

    // exp 에서 현재 시간(밀리세컨즈 제거)을 뺀 값을 ttl로 설정
    const accessTokenExp = validAccessToken.exp;
    const accessTokenTtl = accessTokenExp - Number(String(now).slice(0, -3));
    const refreshTokenExp = validRefreshToken.exp;
    const refreshTokenTtl = refreshTokenExp - Number(String(now).slice(0, -3));

    // Redis에 토큰 저장 (redis - blacklist 생성)
    await this.cacheManager.set(
      `accessToken:${accessToken}`,
      'accessToken', //
      { ttl: accessTokenTtl },
    );
    await this.cacheManager.set(
      `refreshToken:${refreshToken}`,
      'refreshToken',
      { ttl: refreshTokenTtl },
    );

    return '로그아웃에 성공했습니다.';
  }

  @Mutation(() => String)
  async createMailToken(
    @Args('email') email: string, //
  ) {
    const sendTokenToMail = await this.authsService.sendMailToken({ email });

    return sendTokenToMail
      ? '입력하신 메일로 인증번호가 발송되었습니다. 인증번호는 5분간 유효합니다.'
      : '토큰 발급에 실패했습니다. 관리자에게 문의하세요';
  }

  @Mutation(() => Boolean)
  async verifyMailToken(
    @Args('email') email: string, //
    @Args('code') code: string,
  ) {
    const isValid = await this.authsService.validateMailToken({ email, code });
    return isValid;
  }
}
