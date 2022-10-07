import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/adminUser.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const { JWT_ADMIN_ACCESS_SECRET, JWT_ADMIN_REFRESH_SECRET } = process.env;

/**
 * Admin User Service
 */
@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUsersRepository: Repository<AdminUser>, //
    private readonly jwtService: JwtService,
  ) {}

  /**
   * FIND ALL ADMIN USERS
   * @returns
   */
  findAll() {
    return this.adminUsersRepository.find();
  }

  /**
   * FIND ADMIN USER BY ACCOUNT
   * @param account adminUser 계정
   * @returns adminUser 계정정보
   */
  findOne({ account }) {
    return this.adminUsersRepository.findOne({ where: { account } });
  }

  /**
   * Set Admin Refresh Token On Header
   * @param adminUser 접속한 관리자 정보.
   * @param res Response
   * @param req 전송할 Request
   */
  setAdminRefreshToken({ adminUser, res, req }) {
    const refreshToken = this.jwtService.sign(
      { account: adminUser.account, sub: adminUser.id },
      { secret: JWT_ADMIN_REFRESH_SECRET, expiresIn: '2w' },
    );

    const allowedOrigins = process.env.CORS_URLS.split(', ');
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.recipemaker.shop; SameSite=None; Secure; httpOnly;`,
    );
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }
  /**
   * Generate Admin Access Token
   * @param adminUser 접속한 관리자 정보.
   * @returns 발급된 Admin Access Token
   */
  getAdminAccessToken({ adminUser }) {
    return this.jwtService.sign(
      { account: adminUser.account, sub: adminUser.id },
      { secret: JWT_ADMIN_ACCESS_SECRET, expiresIn: '1h' },
    );
  }

  /**
   * Verify Admin Tokens
   * @param accessToken 발급된 admin Access Token
   * @param refreshToken 발급된 admin Refresh Token
   * @returns 인증된 admin access, refresh tokens
   */
  verifyAdminTokens({ accessToken, refreshToken }) {
    try {
      const validAccessToken = jwt.verify(accessToken, JWT_ADMIN_ACCESS_SECRET);
      const validRefreshToken = jwt.verify(
        refreshToken,
        JWT_ADMIN_REFRESH_SECRET,
      );
      if (
        typeof validAccessToken === 'object' &&
        typeof validRefreshToken === 'object'
      ) {
        return { validAccessToken, validRefreshToken };
      } else {
        throw new Error(`Token의 payload값이 객체 형태로 반환되지 않았습니다.
        accessToken 내용 : ${validAccessToken}
        refreshToken 내용 : ${validRefreshToken}`);
      }
    } catch (error) {
      throw new UnauthorizedException(error.response.message);
    }
  }

  /**
   * CREATE ADMIN USER
   * @param account 관리자 계정
   * @param password 관리자 계정 비밀번호
   * @returns 생성된 관리자 계정 정보
   */
  async create({ account, password }) {
    const user = await this.adminUsersRepository.findOne({
      where: { account },
    });
    if (user) throw new ConflictException('이미 등록된 계정입니다.');
    const salt = process.env.BCRYPT_ADMIN_SALT;
    const hashedPassword = await bcrypt.hash(password, Number(salt));
    return this.adminUsersRepository.save({
      account,
      password: hashedPassword,
    });
  }

  /**
   * Soft Delete Admin User
   * @param account 관리자 계정
   * @returns 삭제여부 (true, false)
   */
  async delete({ account }) {
    const result = await this.adminUsersRepository.softDelete({ account });
    return result.affected ? true : false;
  }
}
