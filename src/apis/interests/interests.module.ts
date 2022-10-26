import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestChatMessage } from '../interestChatMessages/entities/interestChatMessage.entity';
import { InterestChatRoom } from '../interestChatRooms/entities/interestChatRoom.entity';
import { InterestChatRoomsService } from '../interestChatRooms/interestChatRooms.service';
import { Interest } from './entities/interest.entity';
import { InterestsResolver } from './interests.resolver';
import { InterestsService } from './interests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interest, //
      InterestChatRoom,
      InterestChatMessage,
    ]),
  ],
  providers: [
    InterestsResolver, //
    InterestsService,
    InterestChatRoomsService,
  ],
})
export class InterestsModule {}
