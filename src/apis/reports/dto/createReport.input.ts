import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReportInput {
  // 신고할 아이디

  @Field(() => String)
  reportId: string;

  // 신고 내용

  @Field(() => String)
  reportContent: string;
}
