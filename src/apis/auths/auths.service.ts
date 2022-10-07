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

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, LOGIN_REDIRECT_URL } =
  process.env;

/**
 * Auth Service
 */
@Injectable()
export class AuthsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Set Refresh Token On Header
   * @param user 접속한 유저 정보.
   * @param res Response
   * @param req 전송할 Request
   */
  setRefreshToken({ user, res, req }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: JWT_REFRESH_SECRET, expiresIn: '2w' },
    );

    const allowedOrigins = process.env.CORS_URLS.split(', ');
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
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
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  /**
   * Generate Access Token
   * @param user 접속한 유저 정보.
   * @returns 발급된 Access Token
   */
  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: JWT_ACCESS_SECRET, expiresIn: '1h' },
    );
  }

  /**
   * social Login - google, naver, kakao
   * @param res Response
   * @param req Request
   */
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

  //

  /**
   * Verify Tokens : JWT 을 이용한 토큰 검증
   * @param accessToken 입력받은 Access Token
   * @param refreshToken 입력받은 Refresh Token
   * @returns 인증완료된 AT, RT
   */
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

  /**
   * Send Mail Token : 임의 생성된 4자리 숫자를 메일로 전송
   * @param email 입력받은 메일주소
   * @returns 전송 성공 여부
   */
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
      .catch((e) => {
        result = false;
        console.log(e);
      });

    // 유저의 계정 : 생성된 토큰 - key : value 값으로 Redis 저장.
    await this.cacheManager.set(email, token, {
      ttl: 300, // 5분
    });
    return result;
  }

  /**
   * Send Mail Token : Redis에 저장된 토큰값을 비교
   * @param email 입력받은 메일주소
   * @param code 입력받은 인증코드
   * @returns 저장된 값과 입력받은 코드의 일치 여부
   */
  async validateMailToken({ email, code }) {
    const result = await this.cacheManager.get(email);
    return result === code;
  }
}
