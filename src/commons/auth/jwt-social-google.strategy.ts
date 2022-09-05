import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(_, __, profile) {
    return {
      email: profile._json.email,
      password: '1.41421356', // 패스워드 임시처리
      // user entity에 pet, phone 이 nullable 하지 않아 임시 추가합니다.
      pet: false,
      phone: '010-1111-2222',
    };
  }
}
