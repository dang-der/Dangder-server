import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessagesResolver } from './chatMessages.resolver';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessage } from './entities/chatMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage, //
    ]),
  ],
  providers: [
    ChatMessagesResolver, //
    ChatMessagesService,
  ],
})
export class ChatMessagesModule {}
