import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'fetchReports의 Return Type' })
export class ReportOutput {
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  targetId: string;

  @Field(() => String, { nullable: true })
  reportContent: string;
}
