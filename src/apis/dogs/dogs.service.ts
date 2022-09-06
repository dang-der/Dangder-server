import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { Dog, GENDER_ENUM } from './entities/dog.entity';
import axios from 'axios';
import { DogImage } from '../dogsImages/entities/dogimage.entity';
import { Character } from '../characters/entities/character.entity';
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,

    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,

    @InjectRepository(DogImage)
    private readonly dogsimagesRepository: Repository<DogImage>,

    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async findAll() {
    return this.dogsRepository.find({
      relations: ['locations', 'interests', 'characters'],
    });
  }

  async getDogInfo({ registerNumber, birth }) {
    const getDogInfo = await axios({
      url: 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo',
      method: 'get',
      params: {
        dog_reg_no: registerNumber,
        owner_birth: birth,
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

  async create({ doginfo, createDogInput }) {
    const { locations, img, interests, characters, ...dog } = createDogInput;

    // 위치정보 저장 로직 미완성, 내일 이어서 진행할 예정
    const location = await this.locationsRepository.save({
      ...locations,
    });
    const createInterests = await Promise.all(
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

    const createCharacters = await Promise.all(
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
    console.log(createCharacters);
    const neut = doginfo.neuterYn === '미중성' ? false : true;
    const result = await this.dogsRepository.save({
      ...dog,
      name: doginfo.dogNm,
      registerNumber: doginfo.dogRegNo,
      gender: doginfo.sexNm,
      isNeut: neut,
      interests: createInterests,
      characters: createCharacters,
      breeds: doginfo.kindNm,
    });

    return result;
    // 이미지 등록 테스트, 메인이미지여부와 GCP 연동 이후에 작업예정
    // await Promise.all(
    //   img.map(
    //     (el, idx) =>
    //       new Promise(async (resolve) => {
    //         const image = el;
    //         //첫번째 사진은 메인, 나머지는 서브로 등록
    //         const ismain = idx === 0 ? true : false;
    //         const newimage = await this.dogsimagesRepository.save({
    //           image: image,
    //           isMain: ismain,
    //           dog: { id: result.id },
    //         });
    //         resolve(newimage);
    //       }),
    //   ),
    // );
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
