import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Breed {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Field(() => [Dog])
  @ManyToMany(() => Dog, (dogs) => dogs.breeds)
  dogs: Dog[];
  // Breed N : Dog M 연결
}
