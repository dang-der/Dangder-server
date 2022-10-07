import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

/**
 * Order Service
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  /**
   * Create Order
   * @param createOrderInput 생성할 주문 정보
   * @returns 생성된 주문 정보
   */
  async create({ createOrderInput }) {
    return this.ordersRepository.save({
      ...createOrderInput,
    });
  }

  /**
   * Fetch Order By Id
   * @param id 주문 Id
   * @returns 조회한 주문 정보
   */
  findOrderId({ id }) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  /**
   * Fetch Order By Phone
   * @param phone 휴대폰 번호
   * @returns 조회한 주문 번호
   */
  findOrderPhone({ phone }) {
    return this.ordersRepository.findOne({ where: { phone } });
  }

  /**
   * Update Order
   * @param id 주문 Id
   * @param updateOrderInput 업데이트 할 주문 정보
   * @returns 업데이트 된 주문 정보
   */

  async update({ id, updateOrderInput }) {
    const orderId = await this.ordersRepository.findOne({
      where: { id },
    });

    const result = await this.ordersRepository.save({
      ...orderId,
      id: id,
      ...updateOrderInput,
    });
    return result;
  }

  /**
   * Delete Order
   * @param id 주문 Id
   * @returns true/false
   */
  async delete({ id }) {
    const result = await this.ordersRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
