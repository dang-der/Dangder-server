import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassTicket } from './entities/passTicket.entity';
import { PassTicketsResolver } from './passTickets.resolver';
import { PassTicketsService } from './passTickets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PassTicket, //
    ]),
  ],
  providers: [
    PassTicketsResolver, //
    PassTicketsService,
  ],
})
export class PassTicketsModule {}
