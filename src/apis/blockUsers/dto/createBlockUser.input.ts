import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBlockUserInput {
  @Field(() => String)
  blockId: string;

  // 차단 대상 유저 id
}
