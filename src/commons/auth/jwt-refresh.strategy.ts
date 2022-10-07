import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refreshToken = req.headers.cookie;
    const token = refreshToken.replace('refreshToken=', '');

    const cachedToken = await this.cacheManager.get(`refreshToken:${token}`);
    if (cachedToken)
      throw new UnauthorizedException('이미 로그아웃된 계정입니다.');

    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
