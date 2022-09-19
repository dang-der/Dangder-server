import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AvoidBreed } from 'src/apis/avoidBreeds/entities/avoidBreed.entity';
import { Character } from 'src/apis/characters/entities/character.entity';
import { Breed } from 'src/apis/breeds/entities/breed.entity';
import { Interest } from 'src/apis/interests/entities/interest.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Location } from 'src/apis/locations/entities/location.entity';
import { DogImage } from 'src/apis/dogsImages/entities/dogImage.entity';
import { Like } from 'src/apis/likes/entities/like.entity';

@Entity()
@ObjectType()
export class Dog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  age: number;

  @Column()
  @Field(() => String)
  gender: string;

  @Column()
  @Field(() => Boolean)
  isNeut: boolean;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  registerNumber: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  birthday: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinTable()
  @Field(() => [Interest])
  @ManyToMany(() => Interest, (interests) => interests.dogs, {
    cascade: true,
  })
  interests: Interest[];

  @JoinTable()
  @Field(() => [AvoidBreed])
  @ManyToMany(() => AvoidBreed, (avoidBreeds) => avoidBreeds.dogs, {
    cascade: true,
  })
  avoidBreeds: AvoidBreed[];

  @JoinTable()
  @Field(() => [Character])
  @ManyToMany(() => Character, (characters) => characters.dogs, {
    cascade: true,
  })
  characters: Character[];

  @JoinTable()
  @Field(() => [Breed])
  @ManyToMany(() => Breed, (breeds) => breeds.dogs, {
    cascade: true,
  })
  breeds: Breed[];

  @JoinColumn()
  @Field(() => Location)
  @OneToOne(() => Location, { cascade: true })
  locations: Location;

  @JoinColumn()
  @Field(() => User)
  @OneToOne(() => User, { cascade: true })
  userId: User;

  @OneToMany(() => DogImage, (dogImage) => dogImage.dog, { cascade: true })
  @Field(() => [DogImage])
  img: DogImage[];

  @OneToMany(() => Like, (like) => like.sendId, { cascade: true })
  @Field(() => [Like])
  sendId: Like[];
}
