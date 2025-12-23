import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    return await this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(limit: number, skip?: number, categoryId?: number) {
    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: skip,
    };

    if (categoryId) {
      const categoryIDFound = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!categoryIDFound) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }

      console.log('Filtering by category ID:', categoryId);

      options.where = {
        category: {
          id: categoryId,
        },
      };
    }

    const [products, total] =
      await this.productRepository.findAndCount(options);

    return {
      data: products,
      pageTotal: products.length,
      total,
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto); // Merge updated fields into the product

    if(updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
      product.category = category;
    }
    await this.productRepository.save(product);
    return `Product #${id} updated`;
  }

  remove(id: string) {
    const product = this.findOne(id);

    if(!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return `Product #${id} removed`;
  }
}
