import { Module } from '@nestjs/common';
import { IamportsResolver } from './imports.resolver';
import { IamportsService } from './imports.services';

@Module({
  imports: [],
  providers: [
    IamportsResolver, //
    IamportsService,
  ],
})
export class IamportsModule {}
