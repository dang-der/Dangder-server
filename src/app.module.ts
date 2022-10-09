import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

// APIs
import { AdminUsersModule } from './apis/adminUsers/adminUsers.module';
import { AuthsModule } from './apis/auths/auths.module';
import { AvoidBreedsModule } from './apis/avoidBreeds/avoidBreeds.module';
import { BlockUsersModule } from './apis/blockUsers/blockUsers.module';
import { BreedsModule } from './apis/breeds/breeds.module';
import { CharactersModule } from './apis/characters/characters.module';
import { ChatMessagesModule } from './apis/chatMessages/chatMessages.module';
import { ChatRoomsModule } from './apis/chatRooms/chatRooms.module';
import { DogsModule } from './apis/dogs/dogs.module';
import { DogsImagesModule } from './apis/dogsImages/dogsImages.module';
import { DonateIOsModule } from './apis/donateIOs/donateIOs.module';
import { DonatesModule } from './apis/donates/donates.module';
import { FilesModule } from './apis/files/files.module';
import { IamportsModule } from './apis/imports/imports.module';
import { InterestsModule } from './apis/interests/interests.module';
import { LikesModule } from './apis/likes/likes.module';
import { LocationsModule } from './apis/locations/locations.module';
import { OrdersModule } from './apis/orders/orders.module';
import { PassTicketsModule } from './apis/passTickets/passTickets.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { ProductsModule } from './apis/products/products.module';
import { ReportsModule } from './apis/reports/reports.module';
import { UsersModule } from './apis/users/users.module';
import { AppController } from './app.controller';
import { ChatModule } from './gateways/chat/chat.module';

@Module({
  imports: [
    AdminUsersModule,
    AuthsModule,
    AvoidBreedsModule,
    BlockUsersModule,
    BreedsModule,
    CharactersModule,
    ChatMessagesModule,
    ChatModule, // chat gateway module
    ChatRoomsModule,
    DogsModule,
    DogsImagesModule,
    DonateIOsModule,
    DonatesModule,
    FilesModule,
    IamportsModule,
    InterestsModule,
    LikesModule,
    LocationsModule,
    OrdersModule,
    PassTicketsModule,
    PaymentsModule,
    ProductsModule,
    ReportsModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      // Cors 추가
      cors: {
        origin: process.env.CORS_URLS.split(', '),
        credential: true,
      },
      // 배포 시 설정
      // debug: false,
      // playground: false,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      charset: 'utf8mb4', // emoji 저장을 위한 charset
    }),
    // redis 연결을 위한 CacheModule 추가
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.CACHE_REDIS_URL,
      isGlobal: true,
    }),
    // Mailer 사용을 위한 MailerModule 추가
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: false,
        auth: {
          user: process.env.MAILER_GMAIL_USER,
          pass: process.env.MAILER_GMAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAILER_GMAIL_SENDER,
      },
      template: {
        dir: __dirname + '/commons/mailTemplates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
