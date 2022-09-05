import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/users.module';
import { AppController } from './app.controller';
import { AvoidBreedsModule } from './apis/avoidBreeds/avoidBreeds.module';
import { BlockUsersModule } from './apis/blockUsers/blockUsers.module';
import { BreedsModule } from './apis/breeds/breeds.module';
import { CharactersModule } from './apis/characters/characters.module';
import { ChatMessagesModule } from './apis/chatMessages/chatMessages.module';
import { DogsModule } from './apis/dogs/dogs.module';
import { ChatRoomsModule } from './apis/chatRooms/chatRooms.module';
import { DonateIOsModule } from './apis/donateIOs/donateIOs.module';
import { DonatesModule } from './apis/donates/donates.module';
import { DogsImagesModule } from './apis/dogsImages/dogsImages.module';
import { InterestsModule } from './apis/interests/interests.module';
import { LikesModule } from './apis/likes/likes.module';
import { LocationsModule } from './apis/locations/locations.module';
import { MailAuthTokensModule } from './apis/mailAuthTokens/mailAuthTokens.module';
import { PaymentsModule } from './apis/payments/payments.module';
import { ReportsModule } from './apis/reports/reports.module';
import { AuthsModule } from './apis/auths/auths.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthsModule,
    AvoidBreedsModule,
    BlockUsersModule,
    BreedsModule,
    CharactersModule,
    ChatMessagesModule,
    ChatRoomsModule,
    DogsModule,
    DogsImagesModule,
    DonateIOsModule,
    DonatesModule,
    InterestsModule,
    LikesModule,
    LocationsModule,
    MailAuthTokensModule,
    PaymentsModule,
    ReportsModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      // Cors 추가
      cors: {
        origin: ['https://dangder.shop'],
        credential: true,
      },
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
    }),
    // redis 연결을 위한 CacheModule 추가
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
