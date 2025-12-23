import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { categories } from './data/categories.seeder';
import { products } from './data/products.seeder';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    console.log('Database dropped!');
    await connection.synchronize();
    console.log('Database synchronized!');
  }

  async seed() {
    await this.categoryRepository.save(categories);
    for await (const seedProduct of products) {
      const category = await this.categoryRepository.findOneBy({
        id: seedProduct.categoryId,
      });
      if (!category) {
        continue;
      }
      const product = new Product();
      product.name = seedProduct.name;
      product.image = seedProduct.image;
      product.price = seedProduct.price;
      product.inventory = seedProduct.inventory;
      product.category = category;
      await this.productRepository.save(product);
    }
  }
}
