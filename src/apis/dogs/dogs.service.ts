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
import { AvoidBreed } from '../avoidBreeds/entities/avoidBreed.entity';
import { Cache } from 'cache-manager';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { ChatRoom } from '../chatRooms/entities/chatRoom.entity';
import { ChatMessage } from '../chatMessages/entities/chatMessage.entity';
import { AroundDogOutput } from './dto/aroundDog.output';

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

    @InjectRepository(AvoidBreed)
    private readonly avoidBreedsRepository: Repository<AvoidBreed>,

    @InjectRepository(DogImage)
    private readonly dogsImagesRepository: Repository<DogImage>,

    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ChatRoom)
    private readonly chatRoomsRepository: Repository<ChatRoom>,

    @InjectRepository(ChatMessage)
    private readonly chatMessagesRepository: Repository<ChatMessage>,

    @InjectRepository(Like)
    private readonly LikesRepository: Repository<Like>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly dataSource: DataSource,
  ) {}

  async findAll(page: number) {
    return await this.dogsRepository.find({
      skip: page ? (page - 1) * 10 : 0, // 1페이지당 10마리씩 조회, 이미 조회한 만큼은 스킵
      take: 10,
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        user: true,
        sendId: true,
      },
    });
  }

  async findOne(id: string) {
    return this.dogsRepository.findOne({
      where: { id },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        user: true,
        sendId: true,
      },
    });
  }

  async findMyDog(userId: string) {
    return this.dogsRepository.findOne({
      where: { user: { id: userId } },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        user: true,
        sendId: true,
      },
    });
  }

  async getAroundDogs({ id, myDog, Dogs }) {
    const myDogLat = myDog.locations.lat;
    const myDogLng = myDog.locations.lng;

    const resultDog = [];

    await Dogs.map((el) => {
      const result = isPointWithinRadius(
        { latitude: myDogLat, longitude: myDogLng },
        { latitude: el.locations.lat, longitude: el.locations.lng },
        5000,
      );
      if (result === true && el.id !== id) resultDog.push(el);
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

  async create({ dogInfo, createDogInput }) {
    const { locations, img, interests, characters, avoidBreeds, ...dog } =
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
    let createAvoidBreeds = null;
    if (avoidBreeds) {
      createAvoidBreeds = await Promise.all(
        avoidBreeds.map(
          (el: any) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevAvoidBreed = await this.avoidBreedsRepository.findOne(
                  {
                    where: { avoidBreed: el },
                  },
                );
                if (prevAvoidBreed) {
                  resolve(prevAvoidBreed);
                } else {
                  const newAvoidBreed = await this.avoidBreedsRepository.save({
                    avoidBreed: el,
                  });
                  resolve(newAvoidBreed);
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
      avoidBreeds: createAvoidBreeds,
      locations: { ...location },
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

  async update({ dogId, updateDogInput, dogRegNum, ownerBirth }) {
    const { img, interests, characters, avoidBreeds, ...dog } = updateDogInput;
    const oneDog = await this.dogsRepository.findOne({
      where: { id: dogId },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        user: true,
        sendId: true,
      },
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

    let createAvoidBreeds = null;
    if (avoidBreeds) {
      await this.dataSource.manager
        .createQueryBuilder()
        .delete()
        .from('dangder.dog_avoid_breeds_avoid_breed')
        .where('dogId = :dogId', {
          dogId: dogId,
        })
        .execute();

      createAvoidBreeds = await Promise.all(
        avoidBreeds.map(
          (el) =>
            new Promise(async (resolve, reject) => {
              try {
                const prevAvoidBreed = await this.avoidBreedsRepository.findOne(
                  {
                    where: { avoidBreed: el },
                  },
                );
                if (prevAvoidBreed) {
                  resolve(prevAvoidBreed);
                } else {
                  const newAvoidBreed = await this.avoidBreedsRepository.save({
                    avoidBreed: el,
                  });
                  resolve(newAvoidBreed);
                }
              } catch (err) {
                reject(err);
              }
            }),
        ),
      );
    }

    // 새로운 강아지 등록번호 입력 시 - 기존 강아지와 연결되어있는 채팅방, 메시지 삭제 후 강아지 삭제
    // 강아지 삭제 후 새로 강아지 생성해서 등록.
    if (dogRegNum) {
      await this.locationsRepository.delete({ id: oneDog.locations.id });
      await this.LikesRepository.delete({ receiveId: dogId });
      await this.chatMessagesRepository.delete({ senderId: dogId });
      await this.chatRoomsRepository.delete({ dog: { id: dogId } });
      await this.dogsRepository.delete({
        user: { id: updateDogInput.userId },
      });
      const dogInfo = await this.getDogInfo({ dogRegNum, ownerBirth });
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
        avoidBreeds: createAvoidBreeds,
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
    } else {
      await this.locationsRepository.delete({ id: oneDog.locations.id });

      const result = await this.dogsRepository.save({
        ...oneDog,
        ...updateDogInput,
        id: dogId,
        interests: createInterests,
        characters: createCharacters,
        avoidBreeds: createAvoidBreeds,
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
  }

  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
