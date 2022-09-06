import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  //위도
  @Column({ type: 'double' })
  @Field(() => Float)
  lat: number;

  //경도
  @Column({ type: 'double' })
  @Field(() => Float)
  lng: number;
}
