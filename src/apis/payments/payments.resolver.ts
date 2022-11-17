import { Args, Query, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import {
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/type/context';
import { IamportsService } from '../imports/imports.services';
import { PassTicketsService } from '../passTickets/passTickets.service';
import { PassTicket } from '../passTickets/entities/passTicket.entity';
import { PaymentOutput } from './dto/paymentOutput';

/**
 * Payment GraphQL API Resolver
 * @APIs `createPayment`, `cancelPayment`, `createPaymentForPoints`, `cancelPaymentForPoints`, `createPaymentForPassTicket`
 */
@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly iamportsService: IamportsService,
    private readonly passTicketsService: PassTicketsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Payment Fetch API
   * @type [`Query`]
   * @returns 결제 정보
   */
  @Query(() => [PaymentOutput], { description: 'Return : 결제 정보' })
  fetchPayments(
    @Args('page') page: number, //
    email: string, //
  ) {
    return this.paymentsService.fetchPayments(page, email);
  }

  /**
   * Payment Create API
   * @type [`Mutation`]
   * @param impUid 아임포트 결제번호
   * @param payMoney 결제 금액
   * @param context 유저 정보
   * @returns 생성된 결제 정보
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: 'Return : 생성된 결제 정보' })
  async createPayment(
    @Args('impUid', { description: '아임포트 결제번호' }) impUid: string, //
    @Args('payMoney', { description: '결제 금액' }) payMoney: number,
    @Context() context: IContext,
  ) {
    // 기존의 로직
    // console.log(context);
    // return this.paymentsService.create({ impUid, payMoney, context });

    // *** 결제 검증 시작 *** //

    // 1. 아임포트 액세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();

    // 2. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken,
      imp_uid: impUid,
    });

    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;

    // 3. 결제정보의 결제금액과 요청받은 결제금액 검증하기

    if (payMoney !== paymentData.amount) {
      throw new UnprocessableEntityException(
        '결제정보의 위조/변조 시도가 발견되었습니다. 요청하신 정보를 저장할 수 없습니다.',
      );
    }

    // *** 결제 검증 종료 *** //

    // 결제 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 내역 저장
    const user = context.req.user;
    const result = this.paymentsService.create({
      impUid,
      payMoney,
      user,
      paymentType: PAYMENT_STATUS_ENUM.PAYMENT,
    });

    // redis

    // 1. 캐시에 등록

    // 현재 시각 date

    // const date = dayjs();

    // date에 30일을 더하는 expireCalculate

    // const expireCalculate = date.add(30, 'day').format('YYYY-MM-DD HH:mm:ss');

    // await this.cacheManager.set(`${user.email}:cert`, true, {
    //   ttl: 60 * 60 * 24 * 30,
    // });

    // passTicketsService의 expiredAt에 expireCalculate를 넣는다.

    // await this.passTicketsService.create({
    //   userId: user.id,
    //   expiredAt: expireCalculate,
    // });

    // 2. 캐시에서 조회

    // const myCache = await this.cacheManager.get(`${user.email}:cert`);

    return result;
  }

  /**
   * Payment Cancel API
   * @type [`Mutation`]
   * @param impUid 아임포트 결제 번호
   * @param context 유저 정보
   * @returns 삭제된 결제 정보
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: 'Return : 삭제된 결제 정보' })
  async cancelPayment(
    @Args('impUid', { description: '아임포트 결제번호' }) impUid: string,
    @Context() context: IContext,
  ) {
    // *** 취소 검증 시작 *** /

    // 1. 입력받은 impUid 값을 통해 payment table에서 data 검증하기.
    await this.paymentsService.checkIsAbleToCancel({
      impUid,
      user: context.req.user,
    });

    // 2. 아임포트 액세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();

    // 3. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken,
      imp_uid: impUid,
    });

    // *** 취소 검증 종료 *** //

    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;

    // *** 부분환불을 위한 전처리(아임포트 Docs 참조) *** //

    // 3-1. 조회한 결제정보로부터 imp_uid, amount(결제금액), cancel_amount환불된 총 금액) 추출
    const { imp_uid, amount, cancel_amount } = paymentData;

    // 3-2. 환불 가능 금액(= 결제금액 - 환불 된 총 금액) 계산
    const cancelAblePayMoney = amount - cancel_amount;
    if (cancelAblePayMoney <= 0) {
      // 이미 전액 환불된 경우
      return new UnprocessableEntityException('이미 전액 환불된 주문입니다.');
    }

    // *** 부분환불을 위한 전처리 끝 *** //

    // 4. 아임포트 서버에서 결제 취소 api 요청
    const canceledPayment = await this.iamportsService.cancelImpPaymentData({
      access_token: impToken,
      reason: '이곳에 환불사유를 입력해주세요',
      imp_uid,
      cancel_request_payMoney: amount, // 부분환불은 테스트모드에서 지원하지 않는다.
      cancelAblePayMoney, // 부분환불은 테스트모드에서 지원하지 않는다.
    });

    console.log(canceledPayment);

    // 결제 취소 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 취소 내역 저장
    const user = context.req.user;
    return this.paymentsService.create({
      impUid,
      payMoney: -amount,
      user,
      paymentType: PAYMENT_STATUS_ENUM.CANCEL,
    });
  }

  /**
   * Payment For Point Create API
   * @type [`Mutation`]
   * @param impUid 아임포트 결제 번호
   * @param payMoney 결제 금액
   * @param context 유저 정보
   * @returns 포인트 결제 내역
   */

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: 'Return : 포인트 결제내역' })
  async createPaymentForPoints(
    @Args('impUid', { description: '아임포트 결제번호' }) impUid: string,
    @Args('payMoney', { description: '결제 금액' }) payMoney: number,
    @Context() context: IContext,
  ) {
    // *** 결제 검증 시작 *** //
    // 1. 아임포트 액세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();
    // 2. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken,
      imp_uid: impUid,
    });
    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;
    // 3. 결제정보의 결제금액과 요청받은 결제금액 검증하기
    if (payMoney !== paymentData.amount) {
      throw new UnprocessableEntityException(
        '결제정보의 위조/변조 시도가 발견되었습니다. 요청하신 정보를 저장할 수 없습니다.',
      );
    }

    // *** 결제 검증 종료 *** //

    // 포인트 충전을 위한 결제 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 내역 저장
    const user = context.req.user;
    return this.paymentsService.createForPoints({
      impUid,
      payMoney,
      user,
      paymentType: PAYMENT_STATUS_ENUM.PAYMENT,
    });
  }

  /**
   * Payment For Point Cancel API
   * @type [`Mutation`]
   * @param impUid 아임포트 결제 번호
   * @param context 유저 정보
   * @returns 포인트 취소내역
   */
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment, { description: 'Return : 포인트 취소내역' })
  async cancelPaymentForPoints(
    @Args('impUid', { description: '아임포트 결제번호' }) impUid: string,
    @Context() context: IContext,
  ) {
    /***   취소 검증 시작   ***/

    // 1. 입력받은 impUid 값을 통해 payment table에서 data 검증하기.
    await this.paymentsService.checkIsAbleToCancel({
      impUid,
      user: context.req.user,
    });

    // 2. 아임포트 액세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();

    // 3. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken,
      imp_uid: impUid,
    });
    // *** 취소 검증 종료 *** //

    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;

    // *** 부분환불을 위한 전처리(아임포트 Docs 참조) *** //
    // 3-1. 조회한 결제정보로부터 imp_uid, payMoney(결제금액), cancel_payMoney(환불된 총 금액) 추출
    const { imp_uid, amount, cancel_amount } = paymentData;
    // 3-2. 환불 가능 금액 (= 결제금액 - 환불 된 총 금액) 계산
    const cancelAblePayMoney = amount - cancel_amount;
    if (cancelAblePayMoney <= 0) {
      // 이미 전액 환불된 경우
      return new UnprocessableEntityException('이미 전액 환불된 주문입니다.');
    }

    // *** 부분환불을 위한 전처리 끝 *** //

    // 4. 아임포트 서버에서 결제 취소 api 요청
    await this.iamportsService.cancelImpPaymentData({
      access_token: impToken,
      reason: '이곳에 환불사유를 입력해주세요',
      imp_uid,
      cancel_request_payMoney: amount, // 부분환불은 테스트모드에서 지원하지 않았습니다.
      cancelAblePayMoney, // 부분환불은 테스트모드에서 지원하지 않았습니다.
    });

    // 결제 취소 테이블 생성 - 결제를 생성한 유저와 연결하여 결제 취소 내역 저장
    const user = context.req.user;
    return this.paymentsService.createForPoints({
      impUid,
      payMoney: -amount,
      user,
      paymentType: PAYMENT_STATUS_ENUM.CANCEL,
    });
  }

  /**
   * Payment For PassTicket Create API
   * @type [`Mutation`]
   * @param impUid 아임포트 결제 정보
   * @param payMoney 결제 금액
   * @param context 유저 정보
   * @returns 유저 정보
   */

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PassTicket)
  async createPaymentForPassTicket(
    @Args('impUid', { description: '아임포트 결제번호' }) impUid: string,
    @Args('payMoney', { description: '결제 금액' }) payMoney: number,
    @Context() context: IContext, //
  ) {
    // *** 결제 검증 시작 *** //
    // 1. 아임포트 액세스 토큰 발급받기
    const impToken = await this.iamportsService.getImpAccessToken();
    // 2. imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await this.iamportsService.getImpPaymentData({
      access_token: impToken,
      imp_uid: impUid,
    });
    // 조회한 결제 정보
    const paymentData = getPaymentData.data.response;
    // 3. 결제정보의 결제금액과 요청받은 결제금액 검증하기
    console.log(paymentData, '11111111');
    if (payMoney !== paymentData.amount) {
      throw new UnprocessableEntityException(
        '결제정보의 위조/변조 시도가 발견되었습니다. 요청하신 정보를 저장할 수 없습니다.',
      );
    }

    // *** 결제 검증 종료 *** //

    //

    const user = context.req.user;
    return this.paymentsService.createForPassTickets({
      user,
    });
  }
}
