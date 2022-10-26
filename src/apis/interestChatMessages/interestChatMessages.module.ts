import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestChatMessagesResolver } from './interestChatMessages.resolver';
import { InterestChatMessagesService } from './interestChatMessages.service';
import { InterestChatMessage } from './entities/interestChatMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InterestChatMessage, //
    ]),
  ],
  providers: [
    InterestChatMessagesResolver, //
    InterestChatMessagesService,
  ],
})
export class InterestChatMessagesModule {}
