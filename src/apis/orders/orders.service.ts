import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  // 주문 정보 생성
  async create({ createOrderInput }) {
    return this.ordersRepository.save({
      ...createOrderInput,
    });
  }

  // id로 주문 정보 조회
  findOrderId({ id }) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  // phone으로 주문 정보 조회
  findOrderPhone({ phone }) {
    return this.ordersRepository.findOne({ where: { phone } });
  }

  // id로 업데이트

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

  // 삭제

  async delete({ id }) {
    const result = await this.ordersRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
