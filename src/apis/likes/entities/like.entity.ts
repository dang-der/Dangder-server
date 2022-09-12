import { Field, ObjectType } from '@nestjs/graphql';
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
export class Like {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  receiveId: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinColumn()
  @ManyToOne(() => Dog, (dog) => dog.sendId)
  @Field(() => Dog)
  sendId: Dog;
}
