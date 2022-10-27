import { ObjectType, Field } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { ReviewDetail } from 'src/apis/reviewDetails/entities/reviewDetail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reviewMessage: string;

  @Column()
  @Field(() => String)
  receiveReviewId: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @OneToMany(() => ReviewDetail, (reviewDetails) => reviewDetails.review)
  @Field(() => [ReviewDetail])
  reviewDetail: ReviewDetail[];

  @JoinColumn()
  @ManyToOne(() => Dog, (dog) => dog.sendReview, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Dog)
  sendReview: Dog;
}
