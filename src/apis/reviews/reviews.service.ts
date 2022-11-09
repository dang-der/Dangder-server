import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { ReviewDetail } from '../reviewDetails/entities/reviewDetail.entity';
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

    @InjectRepository(ReviewDetail)
    private readonly reviewDetailsRepository: Repository<ReviewDetail>,
  ) {}

  async findAll() {
    return this.reviewsRepository.find();
  }

  async findReceive(id) {
    return this.reviewsRepository.find({
      where: { receiveReviewId: id },
      relations: { reviewDetail: true, sendReview: { img: true } },
      order: { sendReview: { img: { isMain: 'DESC' } } },
    });
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
    const { reviewDetail } = createReviewInput;
    const myDog = await this.dogsRepository.findOne({
      where: { id: createReviewInput.sendReview },
      relations: { sendReview: true },
    });

    let createReviewDetails = null;
    if (reviewDetail) {
      createReviewDetails = await Promise.all(
        reviewDetail.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevReviewDetail =
                  await this.reviewDetailsRepository.findOne({
                    where: { reviewDetail: el },
                  });
                if (prevReviewDetail) {
                  resolve(prevReviewDetail);
                } else {
                  const newReviewDetail =
                    await this.reviewDetailsRepository.save({
                      reviewDetail: el,
                    });
                  resolve(newReviewDetail);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }

    const result = await this.reviewsRepository.save({
      receiveReviewId: createReviewInput.receiveReviewId,
      reviewMessage: createReviewInput.reviewMessage,
      reviewDetail: createReviewDetails,
      sendReview: myDog,
    });

    return result;
  }

  async findOne({ myId, targetId }) {
    const review = await this.reviewsRepository.findOne({
      where: { sendReview: { id: myId }, receiveReviewId: targetId },
      relations: { reviewDetail: true },
    });

    return review ? true : false;
  }

  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
