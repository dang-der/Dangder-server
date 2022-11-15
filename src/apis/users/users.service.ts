import {
  CACHE_MANAGER,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Dog } from '../dogs/entities/dog.entity';
import { UserOutput } from './dto/userOutput.output';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { UserElasticsearchOutPut } from './dto/userElasticsearch.output';

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

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async search({ search }) {
    const redisUser = await this.cacheManager.get(search);
    if (redisUser) {
      console.log('redis에서 찾음');
      console.log(redisUser);
      console.log('==========================');
      return redisUser;
    }

    // 3. miss => Elasticsearch에서 검색
    console.time('ELA에서 찾음');
    const result = await this.elasticsearchService.search({
      index: 'user',
      query: {
        term: { email: search },
      },
    });
    console.log(result, '----------------------');

    console.timeEnd('ELA에서 찾음');

    // 4. 조회한 결과를 redis에 등록
    // email, dog.name, dog.id, reportCnt, isStop, createdAt, deletedAt

    const result2 = result.hits.hits.map((el: any) => ({
      email: el._source.email,
      createdAt: el._source.createdAt,
      deletedAt: el._source.deletedAt,
      reportCnt: el._source.reportCnt,
      isStop: el._source.isStop,
      id: el._source.id,
      name: el._source.name,
    }));

    const searchResult = [];
    result2.map((userSearch) => {
      const userOutput = new UserElasticsearchOutPut();
      userOutput.email = userSearch.email;
      userOutput.createdAt = userSearch.createdAt;
      userOutput.deletedAt = userSearch.deletedAt;
      userOutput.reportCnt = userSearch.reportCnt;
      userOutput.isStop = userSearch.isStop;
      userOutput.dogId = userSearch.id;
      userOutput.dogName = userSearch.name;
      searchResult.push(userOutput);
    });

    await this.cacheManager.set(search, searchResult, {
      ttl: 3,
    });
    console.log('================');
    console.log('redis에 저장');
    // 5. 조회한 결과를 클라이언트로 반환
    return searchResult;
  }

  /**
   * Find All User
   * @returns 유저 전체 정보
   */

  findAll(page: number) {
    return this.usersRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      relations: { dog: true },
    });
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

  /**
   * Stop User
   * @param id 유저 id
   * @returns 업데이트 된 유저 정보
   */
  async stopUser({ id }) {
    // 수동으로 유저 정지

    const manualStop = await this.usersRepository.findOne({ where: { id } });

    const result = await this.usersRepository.save({
      ...manualStop,
      isStop: true,
    });

    return result;
  }

  async changeReportCnt({ id }) {
    const findUser = await this.usersRepository.findOne({ where: { id } });

    const cnt = findUser.reportCnt;

    const result = await this.usersRepository.save({
      ...findUser,
      reportCnt: cnt + 1,
    });

    if (result.reportCnt >= 3) {
      return this.usersRepository.save({
        ...findUser,
        reportCnt: cnt + 1,
        isStop: true,
      });
    }

    return result;
  }
}
