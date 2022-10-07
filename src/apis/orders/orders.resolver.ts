import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateOrderInput } from './dto/createOrder.input';
import { UpdateOrderInput } from './dto/updateOrder.input';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

/**
 * Order GraphQL API Resolver
 * @APIs `createOrder`, `fetchOrderById`, `fetchOrderByPhone`, `updateOrder`, `deletetOrder`
 */
@Resolver()
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService, //
  ) {}

  /**
   * Order Create API
   * @type [`Mutation`]
   * @param createOrderInput 생성할 주문 정보
   * @returns 생성된 주문 정보
   */
  @Mutation(() => Order, { description: 'Return : 주문 정보' })
  async createOrder(
    @Args('createOrderInput', { description: '생성된 주문 정보' })
    createOrderInput: CreateOrderInput, //
  ) {
    return this.ordersService.create({ createOrderInput });
  }

  /**
   * Fetch Order By Id API
   * @type [`Query`]
   * @param id 주문 Id
   * @returns 주문 정보
   */
  @Query(() => Order, { description: 'Return : 주문 정보' })
  async fetchOrderById(@Args('id', { description: '주문 Id' }) id: string) {
    return this.ordersService.findOrderId({ id });
  }

  /**
   * Fetch Order By Phone API
   * @type [`Query`]
   * @param phone 휴대폰 번호
   * @returns 주문 정보
   */
  @Query(() => Order, { description: 'Return : 주문 정보' })
  async fetchOrderByPhone(
    @Args('phone', { description: '휴대폰 번호' }) phone: string,
  ) {
    return this.ordersService.findOrderPhone({ phone });
  }

  /**
   * Order Update API
   * @type [`Mutation`]
   * @param id 주문 Id
   * @param updateOrderInput 업데이트 할 주문 정보
   * @returns 업데이트 된 주문 정보
   */
  @Mutation(() => Order, { description: 'Return : 업데이트 된 주문 정보' })
  async updateOrder(
    @Args('id', { description: '주문 Id' }) id: string,
    @Args('updateOrderInput', { description: '업데이트 할 주문 정보' })
    updateOrderInput: UpdateOrderInput,
  ) {
    return this.ordersService.update({ id, updateOrderInput });
  }

  /**
   * Order Delete API
   * @type [`Mutation`]
   * @param id 주문 Id
   * @returns true/false
   */

  @Mutation(() => Boolean, { description: 'Return : 주문 삭제된 시간' })
  async deleteOrder(
    @Args('id', { description: '주문 Id' }) id: string, //
  ) {
    return this.ordersService.delete({ id });
  }
}
