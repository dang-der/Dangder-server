import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDogInput } from './createDog.input';

@InputType()
export class UpdateDogInput extends PartialType(CreateDogInput) {}
