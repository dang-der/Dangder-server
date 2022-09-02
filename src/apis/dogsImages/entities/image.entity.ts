import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  img: string;

  @Column()
  @Field(() => Boolean)
  isMain: boolean;

  @JoinColumn()
  @ManyToOne(() => Dog)
  @Field(() => Dog)
  dog: Dog;
  // Image N : Dog 1 연결
}
