import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvoidBreed } from '../avoidBreeds/entities/avoidBreed.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { Character } from '../characters/entities/character.entity';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { ChatRoom } from '../chatRooms/entities/chatRoom.entity';
import { DogImage } from '../dogsImages/entities/dogImage.entity';
import { Interest } from '../interests/entities/interest.entity';
import { Like } from '../likes/entities/like.entity';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';
import { Dog } from './entities/dog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dog, //
      Interest, //
      Character, //
      AvoidBreed, //
      DogImage, //
      Location, //
      Breed, //
      Like, //
      User,
      ChatRoom,
      ChatMessage,
    ]),
  ],
  providers: [
    DogsResolver, //
    DogsService, //
  ],
})
export class DogsModule {}
