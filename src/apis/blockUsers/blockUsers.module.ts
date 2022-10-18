import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { BlockUserResolver } from './blockUsers.resolver';
import { BlockUsersService } from './blockUsers.service';
import { BlockUser } from './entities/blockUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlockUser, //
      User,
    ]),
  ],
  providers: [
    BlockUserResolver, //
    BlockUsersService,
  ],
})
export class BlockUsersModule {}
