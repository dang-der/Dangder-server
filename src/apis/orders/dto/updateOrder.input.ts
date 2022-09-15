import { InputType, PartialType } from '@nestjs/graphql';
import { CreateOrderInput } from './createOrder.input';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {}
