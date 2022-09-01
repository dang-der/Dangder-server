import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class DonateIO {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  donateLog: string;

  @Column()
  @Field(() => String)
  donateDetail: string;

  @Column()
  @Field(() => Int)
  donateSum: number;
}
