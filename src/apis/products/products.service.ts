import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // 강아지 용품 등록
  async create({ createProductInput }) {
    return this.productsRepository.save({
      ...createProductInput,
    });
  }

  // 강아지 용품 하나 찾기

  async findOneProduct(id) {
    return this.productsRepository.findOne({ where: { id } });
  }

  // 강아지 용품 업데이트

  async update({ id, updateProductInput }) {
    const productId = await this.productsRepository.findOne({
      where: { id },
    });

    const result = await this.productsRepository.save({
      ...productId,
      id: id,
      ...updateProductInput,
    });

    return result;
  }

  // 강아지 용품 삭제
  async delete({ id }) {
    const result = await this.productsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
