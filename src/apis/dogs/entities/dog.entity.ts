import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AvoidBreed } from 'src/apis/avoidBreeds/entities/avoidBreed.entity';
import { Character } from 'src/apis/characters/entities/character.entity';
import { Breed } from 'src/apis/Breeds/entities/Breed.entity';
import { Interest } from 'src/apis/interests/entities/interest.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum GENDER_ENUM { // 실제 ENUM은 이거고
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
// 강아지 성별

registerEnumType(GENDER_ENUM, {
  // 이것은 graphql에 등록하기 위해
  name: 'GENDER_ENUM',
});

// //GENDER 등록

// export enum ISNEUT_ENUM { // 실제 ENUM은 이거고
//   NEUT = 'NEUT',
//   UNNEUT = 'UNNEUT',
// }
// // 중성화

// registerEnumType(ISNEUT_ENUM, {
//   // 이것은 graphql에 등록하기 위해
//   name: 'ISNEUT_ENUM',
// });

// 혹시 ENUM을 나중에 쓸까봐 놔뒀습니다.

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
  @Field(() => String)
  age: string;

  @Column({ type: 'enum', enum: GENDER_ENUM })
  @Field(() => GENDER_ENUM)
  gender: string;

  // @Column({ type: 'enum', enum: ISNEUT_ENUM })
  // @Field(() => ISNEUT_ENUM)
  // isNeut: string;

  @Column()
  @Field(() => Boolean)
  isNeut: boolean;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  registerNumber: string;

  @JoinTable()
  @Field(() => [Interest])
  @ManyToMany(() => Interest, (interests) => interests.dogs)
  interests: Interest[];

  @JoinTable()
  @Field(() => [AvoidBreed])
  @ManyToMany(() => AvoidBreed, (avoidBreeds) => avoidBreeds.dogs)
  avoidBreeds: AvoidBreed[];

  @JoinTable()
  @Field(() => [Character])
  @ManyToMany(() => Character, (characters) => characters.dogs)
  characters: Character[];

  @JoinTable()
  @Field(() => [Breed])
  @ManyToMany(() => Breed, (breeds) => breeds.dogs)
  breeds: Breed[];

  @JoinColumn()
  @Field(() => User)
  @OneToOne(() => User)
  user: User;
}
