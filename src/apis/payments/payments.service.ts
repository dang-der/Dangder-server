import {
  CACHE_MANAGER,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { Cache } from 'cache-manager';
import * as dayjs from 'dayjs';
import { PassTicket } from '../passTickets/entities/passTicket.entity';
import { PaymentOutput } from './dto/paymentOutput';

/**
 * Payment Service
 */
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(PassTicket)
    private readonly passTicketsRepository: Repository<PassTicket>,

    // 트랜잭션 적용을 위한 connection 선언
    private readonly dataSource: DataSource,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Cancel IsAble
   * @param impUid 아임포트 결제정보
   * @param user 유저 정보
   */
  async checkIsAbleToCancel({ impUid, user }) {
    //payment table에 결제 내역이 저장되어 있는지 검증
    const paidPayment = await this.paymentsRepository.findOne({
      where: {
        impUid,
        user: { id: user.id },
        paymentType: PAYMENT_STATUS_ENUM.PAYMENT,
      },
    });
    if (!paidPayment) {
      throw new UnprocessableEntityException(
        '기존 결제내역이 존재하지 않아 취소할 수 없습니다.',
      );
    }

    // payment table에 이미 취소 내역이 저장되어 있는지 검증

    const canceledPayment = await this.paymentsRepository.findOne({
      where: { impUid, paymentType: PAYMENT_STATUS_ENUM.CANCEL },
    });
    if (canceledPayment) {
      throw new UnprocessableEntityException('이미 취소된 결제입니다');
    }
  }

  /**
   * Fetch Payment
   * @returns 결제 정보
   */
  async fetchPayments(page: number) {
    const findPayment = await this.paymentsRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      relations: { user: true },
    });

    const result = [];
    for (let i = 0; i < findPayment.length; i++) {
      const tmp = new PaymentOutput();
      tmp.email = findPayment[i].user.email;
      tmp.payMoney = findPayment[i].payMoney;
      tmp.paymentType = findPayment[i].paymentType;
      tmp.createdAt = findPayment[i].createdAt;
      result.push(tmp);
    }

    return result;
  }

  /**
   * Create Payment
   * @param impUid 아임포트 결제정보
   * @param payMoney 결제 금액
   * @param user 유저 정보
   * @param paymentType 결제 타입
   * @returns 생성된 결제 정보
   */
  async create({ impUid, payMoney, user, paymentType }) {
    // 1. 결제내역 테이블(Payment)에서, 기존 내역 확인
    const checkPayment = await this.paymentsRepository.findOne({
      where: { impUid, paymentType },
    });

    // 1-1. 이미 저장된 결제/취소내역이라면, 오류메시지 전달
    if (checkPayment) {
      if (paymentType === PAYMENT_STATUS_ENUM.PAYMENT)
        throw new ConflictException('이미 저장된 결제내역입니다.');
      if (paymentType === PAYMENT_STATUS_ENUM.CANCEL)
        throw new ConflictException('이미 저장된 취소내역입니다.');
    }

    // 2. 결제/취소 한 유저의 정보 찾아오기
    const buyer = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    // 3. 결제/취소 내역 테이블 (Payment) 에, 결제/취소 내역과 결제/취소 한 유저의 정보 연계하여 생성
    const payment = this.paymentsRepository.create({
      impUid,
      payMoney,
      user: buyer,
      paymentType,
    });

    // 4. 생성한 정보 저장하기
    const result = await this.paymentsRepository.save(payment);

    /* 기존 isCert
    // 5. paymentType이 PAYMENT라면 user에 있는 isCert -> true로 변경

    if (paymentType === PAYMENT_STATUS_ENUM.PAYMENT) {
      await this.usersRepository.save({
        ...user,
        isCert: true,
      });
    }

    // 6. paymentType이 CANCEL이라면 user에 있는 isCert -> false로 변경

    if (paymentType === PAYMENT_STATUS_ENUM.CANCEL) {
      await this.usersRepository.save({
        ...user,
        isCert: false,
      });
    }

    // isCert 바뀌는 것은 된다. 하지만 시간(한 달)이 다 되었을 때?? 는 어떻게 할 것인가?
    // 그리고 PAYMENT(결제된 건) CANCEL(취소된 건)이 여러 개 있을 때는 어떻게 할 것인가?

*/

    // 7. 결제/취소 내역 결과 프론트엔드에 돌려주기
    return result;
  }

  /**
   * Create Point
   * @param impUid 아임포트 결제정보
   * @param payMoney 결제 금액
   * @param user 유저 정보
   * @param paymentType 결제 타입
   * @returns 생성된 결제 정보
   */
  async createForPoints({ impUid, payMoney, user, paymentType }) {
    // === 데이터의 오염을 방지하기 위한 트랜잭션 적용 ==== //
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // ====================== transaction 시작 - SERIALIZABLE ================= //

    await queryRunner.startTransaction('SERIALIZABLE');
    // ======================================================================= //

    try {
      // 1. 결제내역 테이블(Payment)에서, 기존 내역 확인
      // const checkPayment = await this.paymentsRepository.findOne({ where: {impUid, status}});
      const checkPayment = await queryRunner.manager.findOne(Payment, {
        where: { impUid, paymentType },
        lock: { mode: 'pessimistic_write' }, // 이 트랜잭션에서 접근하는 동안, 다른 로직 접근 잠금.
      });

      // 1-1. 이미 저장된 결제/취소내역이라면, 오류메시지 전달
      if (checkPayment) {
        if (paymentType === PAYMENT_STATUS_ENUM.PAYMENT)
          throw new ConflictException('이미 저장된 결제내역입니다.');
        if (paymentType === PAYMENT_STATUS_ENUM.CANCEL)
          throw new ConflictException('이미 저장된 취소내역입니다.');
      }

      // 2. 결제/취소 한 유저의 정보 찾아오기
      // const buyer = await this.usersRepository.findOne({where: { id: user.id }});
      const buyer = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' }, // 이 트랜잭션에서 접근하는 동안, 다른 로직 접근 잠금
      });

      // ######## 2-1. 유저의 포인트 업데이트 ######### //
      const updateUser = this.usersRepository.create({
        ...buyer,
        ddMoney: Number(buyer.ddMoney) + Number(payMoney),
      });
      await queryRunner.manager.save(updateUser);

      // 3. 결제/취소 내역 테이블 (Payment) 에, 결제/취소 내역과 결제/취소 한 유저의 정보 연계하여 생성
      const payment = this.paymentsRepository.create({
        impUid,
        payMoney,
        user: updateUser,
        paymentType,
      });

      // 4.생성한 정보 저장하기
      const result = await queryRunner.manager.save(payment); // queryRunner 를 통한 로직을 이용한 부분을 rollback 가능하다.

      // ================= commit - 성공 확정 선언 =========================== //
      await queryRunner.commitTransaction();
      // ================================================================== //

      // 5. 결제/취소 내역 결과 프론트엔드에 돌려주기
      return result;
    } catch (error) {
      // ======================== rollback - 에러발생 시 ============================ //
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
      // ========================================================================= //
    } finally {
      // ================== 무조건 실행되는 구간 : 연결 해제 ======================= //
      await queryRunner.release();
      // ==================================================================== //
    }
  }

  /**
   * Create PassTicket
   * @param user 유저 정보
   * @returns 생성된 패스 티켓 정보
   */
  // 티켓 생성
  async createForPassTickets({ user }) {
    // === 데이터의 오염을 방지하기 위한 트랜잭션 적용 ==== //
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    // ===================== transaction 시작 - SERIALIZABLE ===================== //
    await queryRunner.startTransaction('SERIALIZABLE');
    // ========================================================================= //

    try {
      // 0. dayjs 로 오늘날짜 date 선언
      const date = dayjs();

      // 0-1. date에 30일을 더하는 expireCalculate
      const expireCalculate = date.add(30, 'day').format('YYYY-MM-DD');

      // 3. 결제/취소 한 유저의 정보 찾아오기
      const passBuyer = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' }, // 이 트랜잭션에서 접근하는 동안, 다른 로직 접근 잠금
      });

      // passBuyer 의 isCert 여부 확인
      const isCert = await this.cacheManager.get(`${passBuyer.email}:cert`);
      if (isCert) {
        throw new ConflictException(
          '기존에 구매한 댕더패스가 유효합니다. 새로운 이용권을 구매하실 수 없습니다.',
        );
      }

      // 1. passTicket 테이블에서, 기존 내역 확인
      const checkPassTicket = await queryRunner.manager.findOne(PassTicket, {
        where: { expiredAt: expireCalculate },
        lock: { mode: 'pessimistic_write' }, // 이 트랜잭션에서 접근하는 동안, 다른 로직 접근 잠금.
      });

      if (checkPassTicket) {
        throw new ConflictException(
          '같은 만료일자의 티켓 구매내역이 존재합니다.',
        );
      }

      // 2. passTicket 테이블에 유저의 정보 연계하여 생성
      const passTicket = this.passTicketsRepository.create({
        expiredAt: expireCalculate,
        user: { id: user.id },
      });

      // 2-1. 생성한 정보 저장하기
      const result = await queryRunner.manager.save(passTicket);

      // 4. 유저의 isCert 업데이트
      const buyer = this.usersRepository.create({
        ...passBuyer,
        isCert: true,
      });
      await queryRunner.manager.save(buyer);

      // ================= commit - 성공 확정 선언 =============================================================
      await queryRunner.commitTransaction();
      // ====================================================================================================

      await this.cacheManager.set(`${user.email}:cert`, true, {
        ttl: 60 * 60 * 24 * 30,
      });

      return result;
    } catch (error) {
      // ======================== rollback - 에러발생 시 ============================ //
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error.response.message,
        error.response.statusCode,
      );
      // ========================================================================= //
    } finally {
      // ========================== 무조건 실행되는 구간 : 연결 해제 ===============================================
      await queryRunner.release();
      // ====================================================================================================
    }
  }
}
