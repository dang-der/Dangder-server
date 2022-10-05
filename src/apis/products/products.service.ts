import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

/**
 * Product Service
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  /**
   * Create Product
   * @param createProductInput 생성할 상품 정보
   * @returns 생성된 상품 정보
   */
  async create({ createProductInput }) {
    return this.productsRepository.save({
      ...createProductInput,
    });
  }

  /**
   * Find One Product
   * @param id 상품 아이디
   * @returns 찾은 상품 하나의 정보
   */

  async findOneProduct(id) {
    return this.productsRepository.findOne({ where: { id } });
  }

  /**
   * Update Product
   * @param id 상품 아이디
   * @param updateProductInput 업데이트 할 상품 정보
   * @returns 업데이트 된 상품 정보
   */

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

  /**
   * Delete Product
   * @param id 상품 아이디
   * @returns true/false
   */
  async delete({ id }) {
    const result = await this.productsRepository.softDelete({ id });
    return result.affected ? true : false;
  }
}
