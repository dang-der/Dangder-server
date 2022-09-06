import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create({ impUid, payMoney, context }) {
    // 1. Payment 테이블에 거래기록 1줄 생성
    const payment = this.paymentsRepository.create({
      impUid: impUid,
      payMoney: payMoney,
      user: context.req.user.id,
      paymentType: PAYMENT_STATUS_ENUM.PAYMENT,
    });
    await this.paymentsRepository.save(payment);
    console.log('service111');
    // 2. 유저의 돈 찾아오기 // 유저의 id에서 찾아온다.

    const user = await this.usersRepository.findOne({
      where: { id: context.req.user.id },
    });
    console.log('service222');
    // 3. 유저의 돈 업데이트
    await this.usersRepository.update(
      { id: context.req.user.id },
      { ddMoney: user.ddMoney + payMoney },
    );
    console.log('service333');
    // 4. 최종결과 프론트엔드에 돌려주기
    console.log(payment, '11112345 payment');
    return payment;
  }
}
