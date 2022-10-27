import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { ReviewDetail } from '../reviewDetails/entities/reviewDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      Dog, //
      ReviewDetail,
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
