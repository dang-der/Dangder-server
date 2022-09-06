import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Location } from './entities/location.entity';
import { IContext } from 'src/commons/type/context';
import { LocationsService } from './locations.service';

@Resolver()
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}
}
