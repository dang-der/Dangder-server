import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class AvoidBreed {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  avoidBreed: string;

  @Field(() => [Dog])
  @ManyToMany(() => Dog, (dogs) => dogs.avoidBreeds)
  dogs: Dog[];
  // AvoidBreed N : Dog M 연결
}
