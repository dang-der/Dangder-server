import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';

/**
 * File GraphQL API Resolver
 * @APIs `uploadFile`
 */
@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  // 파일(미디어 파일)을 클라우드로 업로드하기 위한 함수 -> 저장된 url들 리턴
  /**
   * File Upload API (to GCP Bucket)
   * @type [`Mutation`]
   * @param files 업로드 할 파일들
   * @returns 업로드한 파일의 주소 (postfix)
   */
  @Mutation(() => [String], {
    description:
      'Return : 버킷 주소 (파일 위치). prefix : [https://storage.googleapis.com/]',
  })
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    // 파일이 저장된 클라우드의 url 리턴
    return this.filesService.upload({ files });
  }
}
