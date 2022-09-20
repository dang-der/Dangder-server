import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Field(() => Dog)
  @OneToOne(() => Dog, (dog) => dog.locations, { cascade: true })
  dog: Dog;
}
