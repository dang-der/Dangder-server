import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { InterestChatMessage } from 'src/apis/interestChatMessages/entities/interestChatMessage.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage, //
      InterestChatMessage,
    ]),
  ],
  providers: [
    ChatGateway, //
    ChatService,
  ],
})
export class ChatModule {}
