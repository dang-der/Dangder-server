import { Field, Float, InputType } from '@nestjs/graphql';

@InputType({ description: '메시지 데이터 입력형식' })
export class ChatMessageInput {
  @Field(() => String)
  senderId: string;

  @Field(() => String, { nullable: true })
  message: string;

  @Field(() => Float, { nullable: true })
  lat: number;

  @Field(() => Float, { nullable: true })
  lng: number;

  @Field(() => String, { nullable: true })
  meetAt: string;
}
