import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockUsersService } from '../blockUsers/blockUsers.service';
import { BlockUser } from '../blockUsers/entities/blockUser.entity';
import { Report } from './entities/report.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report, //
      BlockUser,
    ]),
  ],
  providers: [
    ReportsResolver, //
    ReportsService,
    BlockUsersService,
  ],
})
export class ReportsModule {}
