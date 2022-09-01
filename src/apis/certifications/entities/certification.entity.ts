import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Certification {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;
}
