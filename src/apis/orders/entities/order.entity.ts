import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  @Column()
  @Field(() => String)
  comment: string;

  @Column()
  @Field(() => String)
  receiver: string;

  @Column()
  @Field(() => String)
  address: string;

  @Column({ nullable: true })
  @Field(() => String)
  phone: string;

  @Column()
  @Field(() => Int)
  goodsQnt: number;
}
