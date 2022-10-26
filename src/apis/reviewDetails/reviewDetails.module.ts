import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewDetail } from './entities/reviewDetail.entity';
import { ReivewDetailsResolver } from './reviewDetails.resolver';
import { ReivewDetailsService } from './reviewDetails.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewDetail, //
    ]),
  ],
  providers: [ReivewDetailsResolver, ReivewDetailsService],
})
export class ReivewDetailsModule {}
