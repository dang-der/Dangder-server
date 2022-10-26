import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestChatMessage } from '../interestChatMessages/entities/interestChatMessage.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { Like } from '../likes/entities/like.entity';
import { InterestChatRoomsResolver } from './interestChatRooms.resolver';
import { InterestChatRoomsService } from './interestChatRooms.service';
import { InterestChatRoom } from './entities/interestChatRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterestChatRoom, //
      InterestChatMessage,
      Like,
      Dog,
    ]),
  ],
  providers: [
    InterestChatRoomsResolver, //
    InterestChatRoomsService,
  ],
})
export class InterestChatRoomsModule {}
