import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsResolver } from './chatRooms.resolver';
import { ChatRoomsService } from './chatRooms.service';
import { ChatRoom } from './entities/chatRoom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatRoom, //
    ]),
  ],
  providers: [
    ChatRoomsResolver, //
    ChatRoomsService,
  ],
})
export class ChatRoomsModule {}
