import { InputType, OmitType } from '@nestjs/graphql';
import { Location } from '../entities/location.entity';

@InputType()
export class LocationInput extends OmitType(
  Location, //
  ['id', 'dog'], //
  InputType, //
) {}
