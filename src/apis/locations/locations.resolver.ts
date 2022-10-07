import { float } from '@elastic/elasticsearch/lib/api/types';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Location } from './entities/location.entity';

import { LocationsService } from './locations.service';

@Resolver()
export class LocationsResolver {
  constructor(
    private readonly locationsService: LocationsService, //
  ) {}

  @Mutation(() => Location)
  updateDogsLocation(
    @Args('id') id: string, //
    @Args('lat') lat: float, //
    @Args('lng') lng: float,
  ) {
    return this.locationsService.update({ id, lat, lng });
  }
}
