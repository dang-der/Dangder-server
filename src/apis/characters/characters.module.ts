import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersResolver } from './characters.resolver';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Character, //
    ]),
  ],
  providers: [
    CharactersResolver, //
    CharactersService,
  ],
})
export class CharactersModule {}
