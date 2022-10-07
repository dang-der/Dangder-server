import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

/**
 * Product GraphQL API Resolver
 * @APIs `createProduct`, `fetchProduct`, `updateProduct`, `deleteProduct`
 */
@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product, { description: 'Return : 생성된 상품 정보' })
  async createProduct(
    @Args('createProductInput', { description: '상품 정보 입력' })
    createProductInput: CreateProductInput, //
  ) {
    return this.productsService.create({
      createProductInput,
    });
  }

  /**
   * Product Fetch API
   * @type [`Query`]
   * @param id 상품 아이디
   * @returns 찾은 상품 정보
   */
  @Query(() => Product, { description: 'Return : 조회한 상품 정보' })
  async fetchProduct(
    @Args('id', { description: '상품 Id' }) id: string, //
  ) {
    return this.productsService.findOneProduct({ id });
  }

  /**
   * Product Update API
   * @type [`Mutation`]
   * @param id 상품 아이디
   * @param updateProductInput 업데이트 할 상품 정보
   * @returns 업데이트 된 상품 정보
   */

  @Mutation(() => Product, { description: 'Return : 업데이트 된 상품 정보' })
  async updateProduct(
    @Args('id', { description: '상품 Id' }) id: string, //
    @Args('updateProductInput', { description: '업데이트 할 유저 정보' })
    updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update({ id, updateProductInput });
  }

  /**
   * Product Delete API
   * @type [`Mutatioin`]
   * @param id 상품 아이디
   * @returns true/false
   */

  @Mutation(() => Boolean, { description: 'Return : 상품 삭제된 시간' })
  async deleteProduct(
    @Args('id', { description: '상품 Id' }) id: string, //
  ) {
    return this.productsService.delete({ id });
  }
}
