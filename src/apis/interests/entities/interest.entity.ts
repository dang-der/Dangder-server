import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { InterestChatRoom } from 'src/apis/interestChatRooms/entities/interestChatRoom.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
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

  // Interest N : Dog M 연결
  @Field(() => [Dog])
  @ManyToMany(() => Dog, (dogs) => dogs.interests, { onUpdate: 'CASCADE' })
  dogs: Dog[];

  // Interest : InterestChatRoom - 1:1 연결
  @OneToOne(() => InterestChatRoom, (iChatRoom) => iChatRoom.interest)
  @Field(() => InterestChatRoom)
  iChatRoom: InterestChatRoom;
}
