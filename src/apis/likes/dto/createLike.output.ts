import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '좋아요를 눌렀을 때 매칭여부와 sendId, receiveId' })
export class CreateLikeOutput {
  @Field(() => Boolean)
  isMatch: boolean;

  @Field(() => String)
  sendId: string;

  @Field(() => String)
  receiveId: string;
}
