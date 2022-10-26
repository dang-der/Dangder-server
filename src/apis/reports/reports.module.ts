import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockUsersService } from '../blockUsers/blockUsers.service';
import { BlockUser } from '../blockUsers/entities/blockUser.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Report } from './entities/report.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report, //
      BlockUser,
      User,
      Dog,
    ]),
  ],
  providers: [
    ReportsResolver, //
    ReportsService,
    BlockUsersService,
    UsersService,
  ],
})
export class ReportsModule {}
