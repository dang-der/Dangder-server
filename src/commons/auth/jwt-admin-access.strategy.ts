import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAdminAccessStrategy extends PassportStrategy(
  Strategy,
  'adminAccess',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ADMIN_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accessToken = req.headers.authorization;
    const token = accessToken.replace('Bearer ', '');

    const cachedToken = await this.cacheManager.get(`accessToken:${token}`);
    if (cachedToken)
      throw new UnauthorizedException('이미 로그아웃된 계정입니다.');

    return {
      account: payload.account,
      id: payload.sub,
    };
  }
}
