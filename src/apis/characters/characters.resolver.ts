import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CharactersService } from './characters.service';
import { Character } from './entities/character.entity';

/**
 * Character GraqhQL API Resolver
 * @APIs `fetchCharacters`, `createCharacter`, `deleteCharacter`
 */
@Resolver()
export class CharactersResolver {
  constructor(
    private readonly charactersService: CharactersService, //
  ) {}

  /**
   * fetchCharacters API
   * [`Query`]
   * @returns 등록된 모든 성격 정보
   */
  @Query(() => [Character], { description: '성격 정보 조회' })
  async fetchCharacters() {
    return this.charactersService.findAll();
  }

  /**
   * createCharacter API
   * [`Mutation`]
   * @param character 등록할 성격
   * @returns 등록한 성격 정보
   */
  @Mutation(() => Character)
  async createCharacter(
    @Args('character') character: string, //
  ) {
    return this.charactersService.create(character); //
  }

  /**
   * deleteCharacter API
   * [`Mutation`]
   * @param id 성격 uuid
   * @returns 성격 정보 삭제 여부
   */
  @Mutation(() => Boolean)
  deleteCharacter(
    @Args('id') id: string, //
  ) {
    return this.charactersService.delete({ id });
  }
}
