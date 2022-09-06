import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

// .env 내부 선언 데이터
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, LOGIN_REDIRECT_URL } =
  process.env;

@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService, //
    // Mailer 사용을 위한 서비스 주입
    private readonly mailerService: MailerService,
    // redis 사용을 위한 cacheManager 선언
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // Refresh Token 생성 -> response header 에 넣어주는 과정
  setRefreshToken({ user, res, req }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: JWT_REFRESH_SECRET, expiresIn: '2w' },
    );

    // 개발환경
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포환경 - path 와 domain 설정, Secure - https / httpOnly - http
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.dangder.shop; SameSite=None; Secure; httpOnly;`);
    // res.setHeader('Access-Control-Allow-Origin', 'https://dangder.shop');
    const allowedOrigins = [
      'https://recipemaker.shop',
      'http://localhost:3000',
      'https://dangder.shop',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.recipemaker.shop; SameSite=None; Secure; httpOnly;`,
    );
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
    this.setRefreshToken({ user, res, req });
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

  // 랜덤한 4자리 수 토큰 생성 후 메일보내기.
  async sendMailToken({ email }) {
    const token = String(Math.floor(Math.random() * 10 ** 4)).padStart(4, '0');

    let result = false;
    await this.mailerService
      .sendMail({
        to: email,
        from: 'noreply@dangder.com',
        subject: '[🐾Dangder] 메일 인증번호가 발급되었습니다.',
        template: '/dangder/src/commons/mailTemplates/tokenSend', // The `.pug` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          code: token,
        },
      })
      .then(() => {
        result = true;
      })
      .catch((err) => {
        result = false;
        console.log(err);
      });

    // 유저의 계정 : 생성된 토큰 - key : value 값으로 Redis 저장.
    await this.cacheManager.set(email, token, {
      ttl: 300, // 5분
    });
    return result;
  }

  // Redis에 저장된 토큰값을 비교
  async validateMailToken({ email, code }) {
    const result = await this.cacheManager.get(email);
    return result === code;
  }
}
