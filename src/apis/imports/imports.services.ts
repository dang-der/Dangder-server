import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class IamportsService {
  async getImpAccessToken() {
    try {
      const result = await axios({
        url: 'https://api.iamport.kr/users/getToken',
        method: 'post', // POST method
        headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IAMPORT_REST_API_KEY, // REST API키
          imp_secret: process.env.IAMPORT_REST_API_SECRET, // REST API Secret
        },
      });
      return result.data.response.access_token;
    } catch (e) {
      // 아임포트 서버에서 Access Token 발급에 실패했을 때
      // (Docs - 401 imp_key, imp_secret 인증에 실패한 경우)
      if (e.response.status === 401)
        throw new UnauthorizedException(e.response.data.message);
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }

  async getImpPaymentData({ access_token, imp_uid }) {
    // * resolver에서 필요해서 넣었다.
    try {
      const paymentData = await axios({
        url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
        method: 'get', // GET method
        headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      });
      return paymentData;
    } catch (e) {
      // 아임포트 서버에서 결제 정보를 가져올 수 없었을 때
      // (Docs - 401 인증 Token이 전달되지 않았거나 유효하지 않은 경우)
      if (e.response.status === 401)
        throw new UnauthorizedException(e.response.data.message);
      // (Docs - 404 유효하지 않은 imp_uid)
      if (e.response.stataus === 401)
        throw new NotFoundException(e.response.data.message);
      // throw new UnprocessableEntityException(e.response.data.message);
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }

  /* 아임포트 REST API로 결제환불 요청 */
  async cancelImpPaymentData({
    access_token,
    reason,
    imp_uid,
    cancel_request_payMoney,
    cancelAblePayMoney,
  }) {
    try {
      const getCancelData = await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token, // 아임포트 서버로부터 발급받은 엑세스 토큰
        },
        data: {
          reason, // 가맹점 클라이언트로부터 받은 환불사유
          imp_uid, // imp_uid를 환불 `unique key`로 입력
          payMoney: cancel_request_payMoney, // 가맹점 클라이언트로부터 받은 환불금액
          checksum: cancelAblePayMoney, // [권장] 환불 가능 금액 입력
        },
      });
      const result = getCancelData.data; // 환불 결과
      return result;
    } catch (e) {
      // 아임포트 서버에서 환불 과정을 진행할 수 없을 때
      // (Docs - 401	인증 Token이 전달되지 않았거나 유효하지 않은 경우)
      if (e.response.status === 401)
        throw new UnauthorizedException(e.response.data.message);
      throw new HttpException(e.response.data.message, e.response.status);
    }
  }
}
