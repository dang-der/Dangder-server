import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Dog } from '../dogs/entities/dog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review, //
      Dog, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
