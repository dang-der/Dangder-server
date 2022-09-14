import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsService } from '../chatRooms/chatRooms.service';
import { ChatRoom } from '../chatRooms/entities/chatRoom.entity';
import { Dog } from '../dogs/entities/dog.entity';
import { DogsImagesService } from '../dogsImages/dogsImages.service';
import { DogImage } from '../dogsImages/entities/dogImage.entity';
import { Like } from './entities/like.entity';
import { LikesResolver } from './likes.resolver';
import { LikesService } from './likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Like, //
      Dog, //
      ChatRoom, //
      DogImage,
    ]),
  ],
  providers: [
    LikesResolver, //
    LikesService, //
    ChatRoomsService, //
    DogsImagesService, //
  ],
})
export class LikesModule {}
