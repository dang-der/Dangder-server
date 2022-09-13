import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { Dog } from './entities/dog.entity';
import axios from 'axios';
import { DogImage } from '../dogsImages/entities/dogimage.entity';
import { Character } from '../characters/entities/character.entity';
import { Location } from '../locations/entities/location.entity';
import { Breed } from '../breeds/entities/breed.entity';
import { getDistance, isPointWithinRadius } from 'geolib';
import { AvoidBreed } from '../avoidBreeds/entities/avoidBreed.entity';
import { Cache } from 'cache-manager';
import { DistanceType } from '../distancesType/entities/distanceType.entity';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { getToday } from 'src/commons/libraries/utils';

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

    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    return this.dogsRepository.find({
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        userId: true,
        sendId: true,
      },
    });
  }

  async findOne(id) {
    return this.dogsRepository.findOne({
      where: { id },
      relations: {
        locations: true,
        interests: true,
        characters: true,
        avoidBreeds: true,
        img: true,
        userId: true,
        sendId: true,
      },
    });
  }

  async getAroundDogs({ id, myDog, Dogs }) {
    const myDoglat = myDog.locations.lat;
    const myDoglng = myDog.locations.lng;

    const resultDog = [];
    for (let i = 0; i < Dogs.length; i++) {
      const result = isPointWithinRadius(
        { latitude: myDoglat, longitude: myDoglng },
        { latitude: Dogs[i].locations.lat, longitude: Dogs[i].locations.lng },
        5000,
      );
      if (result === true) resultDog.push(Dogs[i]);
    }
    const resultDistance = {};
    for (let i = 0; i < resultDog.length; i++) {
      const distance = getDistance(
        { latitude: myDoglat, longitude: myDoglng },
        {
          latitude: resultDog[i].locations.lat,
          longitude: resultDog[i].locations.lng,
        },
      );
      if (distance !== 0)
        resultDistance[resultDog[i].id] = Math.floor(distance / 1000);
    }

    await this.cacheManager.set(id, resultDistance, {
      ttl: 60 * 60, //1시간
    });

    return resultDog;
  }

  async getDogsDistance({ id }) {
    const result = [];
    const distance = await this.cacheManager.get(id);

    for (let i = 0; i < Object.keys(distance).length; i++) {
      const tmp = new DistanceType(); //객체 타입 리턴 받기 위해 새로운 타입 지정
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

    await Promise.all(
      img.map(
        (el, idx) =>
          new Promise(async (resolve) => {
            const image = el;
            const ismain = idx === 0 ? true : false;
            const newimage = await this.dogsImagesRepository.save({
              img: image,
              isMain: ismain,
              dog: { id: result.id },
            });
            resolve(newimage);
          }),
      ),
    );
    return result;
  }

  async update({ id, updatedogInput }) {
    const dog = await this.dogsRepository.findOne({
      where: { id },
    });

    const result = this.dogsRepository.save({
      ...dog,
      id,
      ...updatedogInput,
    });
    return result;
  }

  async delete({ id }) {
    const result = await this.dogsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
