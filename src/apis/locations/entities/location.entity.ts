import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import {
  Column,
  Double,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => Double)
  lat: number;

  //위도

  @Column()
  @Field(() => Double)
  lng: number;

  //경도

  @JoinColumn()
  @Field(() => Dog)
  @OneToOne(() => Dog)
  dog: Dog;
}
