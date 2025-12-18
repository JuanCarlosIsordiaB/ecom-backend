import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;

  @OneToMany(() => TransactionContent, (transaction) => transaction.transaction, {
    cascade: true,
    eager: true,
  })
  contents: TransactionContent[];
}

@Entity()
export class TransactionContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;

  @ManyToOne(() => Transaction, (transaction) => transaction.contents, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;
}
