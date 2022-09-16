import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/apis/chatMessages/entities/chatMessage.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage, //
    ]),
  ],
  providers: [
    ChatGateway, //
    ChatService,
  ],
})
export class ChatModule {}
