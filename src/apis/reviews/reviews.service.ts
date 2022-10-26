import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { CreateReviewInput } from './dto/createReview.input';
import { UpdateReviewInput } from './dto/updateReview.input';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>, //
  ) {}

  async findReceive(id) {
    return this.reviewsRepository.find({ where: { receiveReviewId: id } });
  }

  async findSend(id) {
    const myDog = await this.dogsRepository.findOne({
      where: { id },
      relations: {
        sendReview: true,
      },
    });

    return myDog.sendReview;
  }

  async create(createReviewInput: CreateReviewInput) {
    const myDog = await this.dogsRepository.findOne({
      where: { id: createReviewInput.sendReview },
      relations: { sendReview: true },
    });
    const result = await this.reviewsRepository.save({
      sendReview: myDog,
      receiveReviewId: createReviewInput.receiveReviewId,
      reviewDetail: createReviewInput.reviewDetail,
      reviewMessage: createReviewInput.reviewMessage,
    });
    return result;
  }

  update(updateReviewInput: UpdateReviewInput) {
    return '11';
  }

  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
