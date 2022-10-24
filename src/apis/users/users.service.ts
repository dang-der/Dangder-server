import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Dog } from '../dogs/entities/dog.entity';
import { UserOutput } from './dto/userOutput.output';

/**
 * Auth Service
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}

  /**
   * Find All User
   * @returns 유저 전체 정보
   */

  findAll() {
    return this.usersRepository.find();
  }

  /**
   * Find User
   * @param email 유저 이메일
   * @returns 유저 정보
   */
  findOne({ email }) {
    return this.usersRepository.findOne({
      where: { email },
      relations: { dog: true },
    });
  }

  /**
   * Find User and Dog
   * @param email
   * @returns 유저와 강아지 정보
   */

  async findUserAndDog({ email }) {
    const userResult = await this.usersRepository.findOne({
      where: { email },
      relations: { dog: true },
    });

    const dogResult = await this.dogsRepository.findOne({
      where: { id: userResult.dog.id },
      relations: {
        characters: true,
        img: true,
        interests: true,
      },
      order: { img: { isMain: 'DESC' } },
    });

    if (!dogResult) throw new NotFoundException('등록된 강아지가 없습니다.');

    const result = new UserOutput();
    result.user = userResult;
    result.dog = dogResult;

    return result;
  }

  /**
   * Create User
   * @param createUserInput 생성하고 싶은 유저 정보
   * @returns 저장될 유저의 정보
   */
  async create({ createUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');
    // bcrypt 사용하기
    // hash 알고리즘을 사용해 비밀번호를 암호화하는데 hash 메서드의 두 번째 인자는 salt이다.
    // 원본 password를 salt 시켜 준다.
    const salt = process.env.BCRYPT_USER_SALT;
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      Number(salt),
    );
    const result = await this.usersRepository.save({
      ...createUserInput,
      password: hashedPassword,
    });

    return result;
  }

  /**
   * Update User
   * @param email 유저 이메일
   * @param updateUserInput 업데이트할 유저 정보
   * @returns 업데이트 된 유저 정보
   */
  async update({ email, updateUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new ConflictException('이메일이 일치하지 않습니다.');
    const salt = process.env.BCRYPT_USER_SALT;
    const hashedPassword = await bcrypt.hash(
      updateUserInput.password,
      Number(salt),
    );

    const result = await this.usersRepository.save({
      ...user,
      ...updateUserInput,
      password: hashedPassword,
    });
    return result;
  }

  /**
   * Delete User
   * @param email 유저 이메일
   * @returns true/false
   */
  async delete({ email }) {
    // 소프트 삭제 - softDelete
    const user = await this.usersRepository.findOne({ where: { email } });
    await this.dogsRepository.softDelete({ user: { id: user.id } });
    const result = await this.usersRepository.softDelete({ email });
    return result.affected ? true : false;
  }
}
