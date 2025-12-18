import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetOneProductDto, GetProductQueryDto } from './dto/get-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: GetProductQueryDto) {
    console.log('Received query parameters:', query);
    const categoryId = query.category_id
      ? Number(query.category_id)
      : undefined;

    const limit = query.limit ? Number(query.limit) : 15;
    const skip = query.skip ? Number(query.skip) : 0;

    return this.productsService.findAll(limit, skip, categoryId);
  }

  @Get(':id')
  findOne(@Param() params: GetOneProductDto) {
    console.log('Fetching product with ID:', params.id);
    return this.productsService.findOne(params.id);
  }

  @Patch(':id')
update(
  @Param() params: GetOneProductDto, 
  @Body() updateProductDto: UpdateProductDto) {
    console.log('Updating product with ID:', params.id);
  return this.productsService.update(params.id, updateProductDto);
}

  @Delete(':id')
  remove(@Param() params: GetOneProductDto) {
    return this.productsService.remove(params.id);
  }
}
