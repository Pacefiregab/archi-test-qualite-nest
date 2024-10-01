import { Order } from '../entity/order.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order-item')
export class OrderItem {
  constructor(productName: string, quantity: number, price: number) {
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string;

  @Column({
    type: 'int',
  })
  quantity: number;

  @Column({
    type: 'int',
  })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
