import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { Like } from '../likes/entities/like.entity';
import { ChatRoomsResolver } from './chatRooms.resolver';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom, //
      ChatMessage,
      Like,
      Dog,
    ]),
  ],
  providers: [
    ChatRoomsResolver, //
    ChatRoomsService,
  ],
})
export class ChatRoomsModule {}
