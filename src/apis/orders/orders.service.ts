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
  OrderId({ id }) {
    return this.ordersRepository.findOne({ where: { id } });
  }

  // phone으로 주문 정보 조회
  OrderPhone({ phone }) {
    return this.ordersRepository.findOne({ where: { phone } });
  }
}
