import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../dogs/entities/dog.entity';
import { IamportsResolver } from '../imports/imports.resolver';
import { IamportsService } from '../imports/imports.services';
import { PassTicket } from '../passTickets/entities/passTicket.entity';
import { PassTicketsService } from '../passTickets/passTickets.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment, //
      Dog,
      User,
      PassTicket,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    IamportsResolver,
    IamportsService,
    UsersService,
    PassTicketsService,
  ],
})
export class PaymentsModule {}
