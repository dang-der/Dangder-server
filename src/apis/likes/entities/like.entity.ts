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
export class Like {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  receiveId: string;

  //이게 굳이 Dog 테이블과 연관 될 필요가 있을까? 고민
  @JoinColumn()
  @ManyToOne(() => Dog)
  @Field(() => Dog)
  sendId: Dog;
  // Like N : Dog 1 연결
}
