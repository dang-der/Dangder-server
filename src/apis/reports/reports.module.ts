import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report, //
    ]),
  ],
  providers: [
    ReportsResolver, //
    ReportsService,
  ],
})
export class ReportsModule {}
