import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Character {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  character: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Field(() => [Dog])
  @ManyToMany(() => Dog, (dogs) => dogs.characters)
  dogs: Dog[];
  // Character N : Dog M 연결
}
