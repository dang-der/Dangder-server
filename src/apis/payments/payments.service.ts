import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'src/commons/auth/gql-user.param';
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

  async create({ id, payMoney, currentUser }) {
    // 1. Payment 테이블에 거래기록 1줄 생성
    const payment = this.paymentsRepository.create({
      id: id,
      payMoney: payMoney,
      user: currentUser,
      paymentType: PAYMENT_STATUS_ENUM.PAYMENT,
    });
    await this.paymentsRepository.save(payment);

    // 2. 유저의 돈 찾아오기 // 유저의 id에서 찾아온다.
    const user = await this.usersRepository.findOne({ where: { id } });

    // 3. 유저의 돈 업데이트
    await this.usersRepository.update(
      { id: user.id },
      { ddMoney: user.ddMoney + payMoney },
    );

    // 4. 최종결과 프론트엔드에 돌려주기
    return Payment;
  }
}
