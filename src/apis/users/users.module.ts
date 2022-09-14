import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsResolver } from '../dogs/dogs.resolver';
import { DogsService } from '../dogs/dogs.service';
import { Dog } from '../dogs/entities/dog.entity';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, //
      Dog,
    ]),
  ],
  providers: [
    // JwtAccessStrategy,
    // JwtRefreshStrategy,
    UsersResolver, //
    UsersService,
  ],
})
export class UsersModule {}
