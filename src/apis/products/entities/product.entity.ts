import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  productName: string;

  @Column({ default: 0 })
  @Field(() => Int)
  price: number;

  @Column()
  @Field(() => String)
  category: string;

  @Column()
  @Field(() => String)
  description: string;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
