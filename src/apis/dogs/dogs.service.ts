import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { Dog } from './entities/dog.entity';
import axios from 'axios';
import { DogImage } from '../dogsImages/entities/dogImage.entity';
import { Character } from '../characters/entities/character.entity';
import { Location } from '../locations/entities/location.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { getDistance, isPointWithinRadius } from 'geolib';
import { Cache } from 'cache-manager';
import { User } from '../users/entities/user.entity';
import { AroundDogOutput } from './dto/aroundDog.output';
import { LikesService } from '../likes/likes.service';
import { BlockUser } from '../blockUsers/entities/blockUser.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

/**
 * Dog Service
 */
@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,

    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,

    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,

    @InjectRepository(DogImage)
    private readonly dogsImagesRepository: Repository<DogImage>,

    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(BlockUser)
    private readonly blockUsersRepository: Repository<BlockUser>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly dataSource: DataSource,

    private readonly likesService: LikesService,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async search({ search }) {
    const redisDog = await this.cacheManager.get(search);
    if (redisDog) {
      return redisDog;
    }
    // 3. miss => Elasticsearch에서 검색

    const result = await this.elasticsearchService.search({
      index: 'dog',
      query: {
        bool: { should: [{ term: { name: search } }] },
      },
    });

    // 4. 조회한 결과를 redis에 등록
    const result2 = result.hits.hits.map((el: any) => ({
      id: el._source.id,
      name: el._source.name,
      age: el._source.age,
      gender: el._source.gender,
      description: el._source.description,
      registerNumber: el._source.registerNumber,
      userId: el._source.userId,
      email: el._source.email,
      deletedAt:
        el._source.deletedAt === null
          ? null
          : new Date(el._source.deletedAt).toLocaleString(),
      createdAt: new Date(el._source.createdAt).toLocaleString(),
      updatedAt: new Date(
        Math.floor(el._source.updatedAt) * 1000,
      ).toLocaleString(),
    }));

    await this.cacheManager.set(search, result2, {
      ttl: 3,
    });

    // 5. 조회한 결과를 클라이언트로 반환
    return result2;
  }

  /**
   * 모든 강아지 정보조회
   * @param page 조회할 페이지 수
   * @returns 모든 강아지 정보
   */
  async findAll(page: number) {
    return await this.dogsRepository.find({
      skip: page ? (page - 1) * 40 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 40,
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: true,
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });
  }

  /**
   * 강아지 한마리 정보조회
   * @param id 강아지의 uuid
   * @returns 강아지 한마리 정보
   */
  async findOne(id: string) {
    return await this.dogsRepository.findOne({
      where: { id },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: { blockUsers: true },
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });
  }

  /**
   * 유저정보를 통해 강아지 정보 조회
   * @param userId 유저의 uuid
   * @returns 강아지 한마리 정보
   */
  async findMyDog(userId: string) {
    return this.dogsRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: true,
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });
  }

  async findCategoryDogs({ interest }) {
    const category = await this.interestsRepository.findOne({
      where: { interest: interest },
      relations: {
        dogs: true,
      },
    });
    const interestDogs = category.dogs.map((el) => el.id);
    const categoryDogs = [];
    interestDogs.map((el) => {
      const dogs = this.dogsRepository.find({
        where: { id: el },
        relations: {
          locations: true,
          interests: true,
          characters: true,
          img: true,
          user: true,
          sendId: true,
        },
        order: { img: { isMain: 'DESC' } },
      });
      categoryDogs.push(dogs);
    });

    return categoryDogs[0];
  }

  /**
   * 내 위치를 기반으로 반경 5km이내에 있는 강아지들 조회
   * @param id 강아지의 uuid
   * @param myDog 내 강아지 정보
   * @param Dogs 상대 강아지 정보
   * @returns 5km 이내에 있는 강아지 정보
   */
  async getAroundDogs({ id, myDog, Dogs }) {
    const myDogLat = myDog.locations.lat;
    const myDogLng = myDog.locations.lng;
    const resultDog = [];
    const prevLike = [];

    const blockUser = myDog.user.blockUsers.map((el) => el.blockId);

    for (let i = 0; i < Dogs.length; i++) {
      const like = await this.likesService.isLike({
        sendId: Dogs[i].id,
        receiveId: id,
      });
      prevLike.push(like);
    }

    Dogs.map((el, idx) => {
      const result = isPointWithinRadius(
        { latitude: myDogLat, longitude: myDogLng },
        { latitude: el.locations.lat, longitude: el.locations.lng },
        myDog.targetDistance,
      );
      if (
        result === true &&
        el.id !== id &&
        prevLike[idx] === false &&
        blockUser.includes(el.user.id) === false
      ) {
        if (myDog.targetAgeMin <= el.age && el.age <= myDog.targetAgeMax) {
          resultDog.push(el);
        }
      }
    });

    const resultDistance = {};
    resultDog.map((el) => {
      const distance = getDistance(
        { latitude: myDogLat, longitude: myDogLng },
        {
          latitude: el.locations.lat,
          longitude: el.locations.lng,
        },
      );

      if (distance !== 0) resultDistance[el.id] = Math.ceil(distance / 1000); //소수점 이하 절상
    });

    await this.cacheManager.set(id, resultDistance, {
      ttl: 60 * 60, //1시간
    });

    return resultDog;
  }

  /**
   * 상대가 강아지가 얼마나 떨어져 있는지 거리 계산
   * @param id 강아지 uuid
   * @returns 거리
   */
  async getDogsDistance({ id }) {
    const result = [];
    const distance = await this.cacheManager.get(id);

    for (let i = 0; i < Object.keys(distance).length; i++) {
      const tmp = new AroundDogOutput(); //객체 타입 리턴 받기 위해 새로운 타입 지정
      (tmp.dogId = Object.keys(distance)[i]),
        (tmp.distance = Object.values(distance)[i]);
      result.push(tmp);
    }

    return result;
  }

  /**
   * OpenAPI를 통해 강아지 등록번호를 검증하고 해당 강아지의 정보 조회
   * @param dogRegNum 강아지 등록번호
   * @param ownerBirth 견주의 생년월일
   * @returns OpenAPI를 통해 얻은 강아지 정보
   */
  async getDogInfo({ dogRegNum, ownerBirth }) {
    const getDogInfo = await axios({
      url: 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo',
      method: 'get',
      params: {
        dog_reg_no: dogRegNum,
        owner_birth: ownerBirth,
        serviceKey: process.env.OPENAPI_SERVICEKEY,
        _type: 'json',
      },
      headers: {
        'Content-Type': 'application.json',
      },
    }).catch((err) => {
      throw err;
    });

    return getDogInfo['data'].response.body.item;
  }

  /**
   * 새로운 강아지 정보 생성
   * @param dogInfo 강아지 등록번호를 통해 얻은 강아지등록정보
   * @param createDogInput 강아지 생성 정보
   * @returns 생성된 강아지 정보
   */
  async create({ dogInfo, createDogInput }) {
    const { locations, img, interests, characters, userId, ...dog } =
      createDogInput;

    const location = await this.locationsRepository.save({
      ...locations,
    });
    let createInterests = null;
    if (interests) {
      createInterests = await Promise.all(
        interests.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevInterest = await this.interestsRepository.findOne({
                  where: { interest: el },
                });
                if (prevInterest) {
                  resolve(prevInterest);
                } else {
                  const newInterest = await this.interestsRepository.save({
                    interest: el,
                  });
                  resolve(newInterest);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }

    let createCharacters = null;
    if (characters) {
      createCharacters = await Promise.all(
        characters.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevCharacter = await this.charactersRepository.findOne({
                  where: { character: el },
                });
                if (prevCharacter) {
                  resolve(prevCharacter);
                } else {
                  const newCharacter = await this.charactersRepository.save({
                    character: el,
                  });
                  resolve(newCharacter);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }

    const createBreeds = [];
    const prevBreed = await this.breedsRepository.findOne({
      where: { name: dogInfo.kindNm },
    });
    if (prevBreed) createBreeds.push(prevBreed);
    else {
      const newBreed = await this.breedsRepository.save({
        name: dogInfo.kindNm,
      });
      createBreeds.push(newBreed);
    }

    const neut = dogInfo.neuterYn === '미중성' ? false : true;
    const result = await this.dogsRepository.save({
      ...dog,
      name: dogInfo.dogNm,
      registerNumber: dogInfo.dogRegNo,
      gender: dogInfo.sexNm,
      isNeut: neut,
      interests: createInterests,
      characters: createCharacters,
      breeds: createBreeds,
      locations: { ...location },
      user: { id: userId },
    });

    const user = await this.usersRepository.findOne({
      where: { id: createDogInput.userId },
    });
    await this.usersRepository.save({
      ...user,
      pet: true,
    });

    await Promise.all(
      img.map(
        (el: any, idx: number) =>
          new Promise(async (resolve) => {
            const image = el;
            const isMain = idx === 0 ? true : false;
            const newImage = await this.dogsImagesRepository.save({
              img: image,
              isMain: isMain,
              dog: { id: result.id },
            });
            resolve(newImage);
          }),
      ),
    );
    return result;
  }

  /**
   * 강아지 정보 업데이트
   * @param dogId 강아지의 uuid
   * @param updateDogInput 업데이트할 강아지 정보
   * @param dogRegNum 강아지 등록번호
   * @param ownerBirth 견주의 생년월일
   * @returns 업데이트된 강아지 정보
   */
  async update({ dogId, updateDogInput }) {
    const { img, interests, characters, locations } = updateDogInput;
    const oneDog = await this.dogsRepository.findOne({
      where: { id: dogId },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: true,
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });

    let createInterests = null;
    if (interests) {
      await this.dataSource.manager
        .createQueryBuilder()
        .delete()
        .from('dog_interests_interest')
        .where('dogId = :dogId', {
          dogId: dogId,
        })
        .execute();
      createInterests = await Promise.all(
        interests.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevInterest = await this.interestsRepository.findOne({
                  where: { interest: el },
                });
                if (prevInterest) {
                  resolve(prevInterest);
                } else {
                  const newInterest = await this.interestsRepository.save({
                    interest: el,
                  });
                  resolve(newInterest);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }

    let createCharacters = null;
    if (characters) {
      await this.dataSource.manager
        .createQueryBuilder()
        .delete()
        .from('dangder.dog_characters_character')
        .where('dogId = :dogId', {
          dogId: dogId,
        })
        .execute();

      createCharacters = await Promise.all(
        characters.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevCharacter = await this.charactersRepository.findOne({
                  where: { character: el },
                });
                if (prevCharacter) {
                  resolve(prevCharacter);
                } else {
                  const newCharacter = await this.charactersRepository.save({
                    character: el,
                  });
                  resolve(newCharacter);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }
    if (locations) {
      const location = await this.locationsRepository.findOne({
        where: { id: oneDog.locations.id },
      });
      location.lat = updateDogInput.locations.lat;
      location.lng = updateDogInput.locations.lng;
      await this.locationsRepository.save({
        ...location,
      });
    }
    const result = await this.dogsRepository.save({
      ...oneDog,
      ...updateDogInput,
      id: dogId,
      interests: createInterests,
      characters: createCharacters,
    });
    if (img) {
      await this.dogsImagesRepository.delete({ dog: { id: result.id } });
      await Promise.all(
        img.map(
          (el: any, idx: number) =>
            new Promise(async (resolve) => {
              const image = el;
              const isMain = idx === 0 ? true : false;
              const newImage = await this.dogsImagesRepository.save({
                img: image,
                isMain: isMain,
                dog: { id: result.id },
              });
              resolve(newImage);
            }),
        ),
      );
    }
    return result;
  }

  async updateTargetDistance({ dogId, targetDistance }) {
    const oneDog = await this.dogsRepository.findOne({
      where: { id: dogId },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: true,
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });

    const result = await this.dogsRepository.save({
      ...oneDog,
      targetDistance,
    });

    return result;
  }

  async updateTargetAge({ dogId, targetAgeMin, targetAgeMax }) {
    const oneDog = await this.dogsRepository.findOne({
      where: { id: dogId },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        img: true,
        user: true,
        sendId: true,
      },
      order: { img: { isMain: 'DESC' } },
    });

    const result = await this.dogsRepository.save({
      ...oneDog,
      targetAgeMin,
      targetAgeMax,
    });

    return result;
  }
  /**
   * 강아지 정보 소프트삭제
   * @param id 강아지의 uuid
   * @returns 강아지 정보 삭제 여부
   */
  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
