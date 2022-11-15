import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'fetchBlockUsers의 Return Type' })
export class BlockUserOutput {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  blockId: string;
}
