import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

// .env 내부 선언 데이터
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, LOGIN_REDIRECT_URL } =
  process.env;

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService, //
  ) {}

  // Refresh Token 생성 -> response header 에 넣어주는 과정
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: JWT_REFRESH_SECRET, expiresIn: '2w' },
    );

    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포 시 refactor 필요
    // 배포환경 - path 와 domain 설정, Secure - https / httpOnly - http
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.dangder.shop; SameSite=None; Secure; httpOnly;`);
    // res.setHeader('Access-Control-Allow-Origin', 'https://dangder.shop');
  }

  // Access Token 생성 - secret키와 expire주기 설정
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: JWT_ACCESS_SECRET, expiresIn: '1h' },
    );
  }

  // Social Login on Google, Naver, Kakao
  async socialLogin({ req, res }) {
    // 1. 가입확인
    let user = await this.usersService.findOne({ email: req.user.email });

    // 2. 가입되어있지 않다면, 회원가입
    if (!user) {
      // 2-1. Social Login 은 password 를 받지 않기에 비밀번호 무작위 값 입력(임시처리. 수정예정)
      user = await this.usersService.create({
        createUserInput: { ...req.user },
      });
    }
    // 3. 로그인 (AccessToken 만들어서 프론트에 주기)
    this.setRefreshToken({ user, res });
    res.redirect(LOGIN_REDIRECT_URL);
  }

  // jsonwebtoken 을 이용한 토큰 검증
  verifyTokens({ accessToken, refreshToken }) {
    try {
      const validAccessToken = jwt.verify(accessToken, JWT_ACCESS_SECRET);
      const validRefreshToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      if (
        typeof validAccessToken === 'object' &&
        typeof validRefreshToken === 'object'
      ) {
        return { validAccessToken, validRefreshToken };
      } else {
        throw new Error(`Token의 payload값이 객체 형태로 반환되지 않았습니다.
        accessToken 내용 : ${validAccessToken}
        refreshToken 내용 : ${validRefreshToken}`);
      }
    } catch (error) {
      throw new UnauthorizedException(error.response.message);
    }
  }
}
