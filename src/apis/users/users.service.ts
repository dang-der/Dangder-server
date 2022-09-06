import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOne({ email }) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create({ createUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });

    //   throw new HttpException('이미 등록된 이메일입니다.', HttpStatus.CONFLICT);

    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    return this.usersRepository.save({ ...createUserInput });
  }

  async update({ email, updateUserInput }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    // 수정된 입력값 저장
    const result = await this.usersRepository.save({
      ...user,
      ...updateUserInput,
    });
    return result;
  }

  async delete({ email }) {
    // 소프트 삭제 - softDelete
    const result = await this.usersRepository.softDelete({ email });
    return result.affected ? true : false;
  }
}
