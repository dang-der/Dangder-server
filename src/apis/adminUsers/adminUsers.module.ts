import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAdminAccessStrategy } from 'src/commons/auth/jwt-admin-access.strategy';
import { JwtAdminRefreshStrategy } from 'src/commons/auth/jwt-admin-refresh.strategy';
import { AdminUsersResolver } from './adminUsers.resolver';
import { AdminUsersService } from './adminUsers.service';
import { AdminUser } from './entities/adminUser.entity';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([
      AdminUser, //
    ]),
  ],
  providers: [
    AdminUsersResolver, //
    AdminUsersService,
    JwtAdminAccessStrategy, // Admin AccessToken Strategy
    JwtAdminRefreshStrategy, // Admin RefreshToken Strategy
  ],
})
export class AdminUsersModule {}
