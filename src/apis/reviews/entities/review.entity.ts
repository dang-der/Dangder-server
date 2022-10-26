import { ObjectType, Field } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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
  reviewDetail: string;

  @Column()
  @Field(() => String)
  receiveReviewId: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => Dog, (dog) => dog.sendReviewId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Dog)
  sendReviewId: Dog;
}
