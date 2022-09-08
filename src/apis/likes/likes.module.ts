import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Like, //
    ]),
  ],
  providers: [
    LikesResolver, //
    LikesService,
  ],
})
export class LikesModule {}
