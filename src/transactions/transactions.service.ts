import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { isValid, parseISO, startOfDay, endOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly couponsService: CouponsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const total = createTransactionDto.contents.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        

        // Guardar la transacción principal primero
        const transaction = new Transaction();
        transaction.total = total;

        if(createTransactionDto.coupon){
          const coupon = await this.couponsService.validateCoupon(createTransactionDto.coupon);
          const discountAmount = (total * coupon.percentage) / 100;
          transaction.discount = discountAmount;
          transaction.coupon = coupon.name;
          transaction.total = total - discountAmount;
        }
        await transactionEntityManager.save(transaction);

        for (const contents of createTransactionDto.contents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contents.productId,
          });

          const errors: string[] = [];

          if (!product) {
            errors.push(`Product with ID ${contents.productId} not found`);
            throw new NotFoundException(
              `Product with ID ${contents.productId} not found`,
            );
          }
          if (contents.quantity > product.inventory) {
            errors.push(
              `Insufficient inventory for product ID ${contents.productId}`,
            );

            throw new BadRequestException(
              `Insufficient inventory for product ID ${contents.productId}`,
            );
          }

          // Actualizar inventario del producto
          product.inventory -= contents.quantity;
          await transactionEntityManager.save(product);

          // Crear y guardar los contenidos de la transacción
          const transactionContent = new TransactionContents();
          transactionContent.price = contents.price;
          transactionContent.product = product;
          transactionContent.quantity = contents.quantity;
          transactionContent.transaction = transaction;

          await transactionEntityManager.save(transactionContent);
        }
      },
    );

    return {
      message: 'Transaction created successfully',
    };
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true,
      },
    };

    if (transactionDate) {
      const parsedDate = parseISO(transactionDate);
      if (!isValid(parsedDate)) {
        throw new BadRequestException(
          'Invalid date format. Please use YYYY-MM-DD',
        );
      }

      const startOfDayDate = startOfDay(parsedDate);
      const endOfDayDate = endOfDay(parsedDate);
      options.where = {
        transactionDate: Between(startOfDayDate, endOfDayDate),
      };
    }

    return this.transactionRepository.find(options);
  }

  findOne(id: string) {
    const transaction = this.transactionRepository.findOne({
      where: { id },
      relations: {  
        contents: true,
      },
    });

    if(!transaction){
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);

    if(!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    for(const content of transaction.contents) {
      const product = await this.productRepository.findOneBy({
        id: content.product.id,
      });
      if(!product) {
        throw new NotFoundException(`Product with ID ${content.product.id} not found`);
      }
      product.inventory += content.quantity;
      await this.productRepository.save(product);

      const transactionContents = await this.transactionContentsRepository.findOneBy({
        id: content.id,
      }); 
      if (transactionContents) {
        await this.transactionContentsRepository.remove(transactionContents);
      }
    }

    await this.transactionRepository.remove(transaction);
    return `Transaction #${id} removed`;
  }
}
