import { Field, ObjectType } from '@nestjs/graphql';
import { InterestChatRoom } from 'src/apis/interestChatRooms/entities/interestChatRoom.entity';

@ObjectType()
export class InterestCategoryOutput {
  @Field(() => String)
  interest: string;

  @Field(() => String)
  interestImg: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  subTitle: string;

  @Field(() => String)
  iChatRoomId: string;
}
