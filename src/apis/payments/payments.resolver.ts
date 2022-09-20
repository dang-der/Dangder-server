import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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

@Resolver()
export class PaymentsResolver {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly iamportsService: IamportsService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
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

    // 수정 필요(윤달 고려해서)

    await this.cacheManager.set(`${user.email}:cert`, true, {
      ttl: 60 * 60 * 24 * 30,
    });
    const date = new Date();
    // 캐시에서 가져와서 숫자를 변환한다. set 되는 순간 getToday + 30
    console.log(date, '111111');

    const tmp = Number(date) + 60 * 60 * 24 * 30 * 1000;
    console.log(tmp, '222222');

    const expiredAt = new Date(tmp);
    console.log(expiredAt, '333333');

    // 2. 캐시에서 조회

    // const myCache = await this.cacheManager.get(`${user.email}:cert`);

    return result;
  }

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
    if (payMoney !== paymentData.payMoney) {
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
}
