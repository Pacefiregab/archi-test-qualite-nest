import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { OrderStatus } from '../dto/orderDto';
@Entity()
export class Order {

  static MAX_ORDER_ITEMS: number = 5;
  static MIN_ORDER_PRICE: number = 10;
  static MAX_ORDER_PRICE: number = 500;

  //the constructor of the class
  constructor(
    id: string,
    customerName: string,
    orderItems: OrderItem[],
    shippingAddress: string | null,
    invoiceAddress: string | null,
    status: string,
    price: number
  ) {
    this.id = id;
    this.customerName = customerName;
    this.orderItems = orderItems;
    this.createdAt = new Date();
    this.shippingAddress = shippingAddress;
    this.invoiceAddress = invoiceAddress;
    this.status = status;
    this.price = price;
  }

  @CreateDateColumn()
  @Expose({ groups: ['group_orders'] })
  createdAt: Date;

  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_orders'] })
  id: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  price: number;

  @Column()
  @Expose({ groups: ['group_orders'] })
  customerName: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    nullable: true,
  })
  @Expose({ groups: ['group_orders'] })
  orderItems: OrderItem[];

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  invoiceAddress: string | null;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  shippingAddressSetAt: Date | null;

  @Column()
  @Expose({ groups: ['group_orders'] })
  status: string;

  @Column({ nullable: true })
  @Expose({ groups: ['group_orders'] })
  paidAt: Date | null;

  pay() {
    if (this.price > Order.MAX_ORDER_PRICE) {
      throw new Error('Order price is too high');
    }
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Order is not pending');
    }
    this.status = OrderStatus.PAID;
    this.paidAt = new Date();
  }
}
