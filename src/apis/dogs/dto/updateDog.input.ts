import { InputType, PartialType } from '@nestjs/graphql';
import { createDogInput } from './createDog.input';

@InputType()
export class UpdateDogInput extends PartialType(createDogInput) {}
