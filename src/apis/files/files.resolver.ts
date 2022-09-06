import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(
    private readonly filesService: FilesService, //
  ) {}

  // 파일(미디어 파일)을 클라우드로 업로드하기 위한 함수 -> 저장된 url들 리턴
  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    // 파일이 저장된 클라우드의 url 리턴
    return this.filesService.upload({ files });
  }
}
