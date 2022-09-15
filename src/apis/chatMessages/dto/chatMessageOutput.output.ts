import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '메시지 데이터 출력 형식' })
export class ChatMessageOutput {
  @Field(() => String)
  senderId: string;

  @Field(() => String, { nullable: true })
  msg: string;

  @Field(() => Float, { nullable: true })
  lat: number;

  @Field(() => Float, { nullable: true })
  lng: number;

  @Field(() => Date, { nullable: true })
  meetAt: Date;
}
