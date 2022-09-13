import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
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
}
