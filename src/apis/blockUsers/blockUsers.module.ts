import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockUserResolver } from './blockUsers.resolver';
import { BlockUsersService } from './blockUsers.service';
import { BlockUser } from './entities/blockUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlockUser, //
    ]),
  ],
  providers: [
    BlockUserResolver, //
    BlockUsersService,
  ],
})
export class BlockUsersModule {}
