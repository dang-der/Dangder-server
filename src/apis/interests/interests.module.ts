import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interest } from './entities/interest.entity';
import { InterestsResolver } from './interests.resolver';
import { InterestsService } from './interests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interest, //
    ]),
  ],
  providers: [
    InterestsResolver, //
    InterestsService,
  ],
})
export class InterestsModule {}
