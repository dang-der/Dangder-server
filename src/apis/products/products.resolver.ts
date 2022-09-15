import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput')
    createProductInput: CreateProductInput, //
  ) {
    return this.productsService.create({
      createProductInput,
    });
  }

  @Query(() => Product)
  async fetchProduct(
    @Args('id') id: string, //
  ) {
    return this.productsService.findOneProduct({ id });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string, //
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update({ id, updateProductInput });
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id') id: string, //
  ) {
    return this.productsService.delete({ id });
  }
}
