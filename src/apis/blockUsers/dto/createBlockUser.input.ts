import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlockUserInput {
  // 차단 대상 유저 Id

  @Field(() => String)
  blockId: string;
}
