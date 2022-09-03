import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthsResolver } from './auths.resolver';
import { AuthsService } from './auths.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AuthsController } from './auths.controller';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      User, //
    ]),
  ],
  providers: [
    JwtRefreshStrategy, // Refresh Token 을 위한 Strategy
    JwtAccessStrategy, // Strategy 사용을 위한 provider 추가
    JwtGoogleStrategy, // Jwt-google 등록
    JwtNaverStrategy, // Naver Strategy 등록
    JwtKakaoStrategy, // Kakao Strategy 등록
    AuthsResolver, //
    AuthsService,
    UsersService,
  ],
  controllers: [
    AuthsController, // Controller 등록
  ],
})
export class AuthsModule {}
