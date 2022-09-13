import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';

@Resolver()
export class CharactersResolver {
  constructor(
    private readonly charactersService: CharactersService, //
  ) {}

  @Query(() => [Character], { description: '성격 정보 조회' })
  async fetchCharacters() {
    return this.charactersService.findAll();
  }

  @Mutation(() => Character)
  async createCharacter(
    @Args('character') character: string, //
  ) {
    return this.charactersService.create(character); //
  }

  @Mutation(() => Boolean)
  deleteCharacter(
    @Args('id') id: string, //
  ) {
    return this.charactersService.delete({ id });
  }
}
