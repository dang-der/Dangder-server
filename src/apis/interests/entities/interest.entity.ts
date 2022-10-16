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
export class Interest {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  interest: string;

  @Column()
  @Field(() => String)
  interestImg: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  subTitle: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @Field(() => [Dog])
  @ManyToMany(() => Dog, (dogs) => dogs.interests, { onUpdate: 'CASCADE' })
  dogs: Dog[];
  // Interest N : Dog M 연결
}
