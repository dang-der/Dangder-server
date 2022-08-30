import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Support } from 'src/apis/supports/entities/support.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Field(() => String)
  password: string;

  @Column({ default: 0 })
  @Field(() => Int)
  ddMoney: number;

  @Column()
  @Field(() => String)
  cellPhone: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  @Field(() => Int)
  report: number;

  @Column()
  @Field(() => Int)
  support: number;

  @JoinColumn()
  @ManyToOne(() => Support)
  @Field(() => Support)
  supportId: Support;
}
