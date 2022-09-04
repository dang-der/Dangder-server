import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from '../interests/entities/interest.entity';
import { Dog, GENDER_ENUM } from './entities/dog.entity';
import axios from 'axios';
import { DogImage } from '../dogsImages/entities/dogimage.entity';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,

    @InjectRepository(Interest)
    private readonly interestsRepository: Repository<Interest>,

    @InjectRepository(DogImage)
    private readonly dogsimagesRepository: Repository<DogImage>,
  ) {}

  async findAll() {
    return this.dogsRepository.find({
      relations: ['img'],
    });
  }

  async getDogInfo({ registerNumber, name }) {
    // const uri = 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo';
    // const res = encodeURI(uri);

    const getDogInfo = await axios({
      url: 'http://apis.data.go.kr/1543061/animalInfoSrvc/animalInfo',
      method: 'get',
      params: {
        dog_reg_no: registerNumber,
        owner_nm: name,
        serviceKey:
          'URYsnt1urmXyHUZd00NOQQdl01Kr9MI4OgWoPc/0tBrMVPBHbso6WMH0di6m7N9uaAH2pgt8zl2VtRQb0u21bg==',
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
    const { img } = createDogInput;
    const neut = doginfo.neuterYn === '미중성' ? false : true;
    const result = this.dogsRepository.save({
      name: doginfo.dogNm,
      registerNumber: doginfo.dogRegNo,
      gender: doginfo.sexNm,
      isNeut: neut,
      breeds: doginfo.kindNm,
      ...createDogInput,
    });

    await Promise.all(
      img.map(
        (el, idx) =>
          new Promise(async (resolve) => {
            const image = el;
            //첫번째 사진은 메인, 나머지는 서브로 등록
            const ismain = idx === 0 ? true : false;
            const newimage = await this.dogsimagesRepository.save({
              image: image,
              isMain: ismain,
              dog: { id: 'dogId' },
            });
            resolve(newimage);
          }),
      ),
    );
  }

  async update({ id, updatedogInput }) {
    const dog = await this.dogsRepository.findOne({
      where: { id: id },
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
