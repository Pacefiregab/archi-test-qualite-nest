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
  static SHIPPING_PRICE: number = 5;

  //the constructor of the class
  constructor(
    id?: string,
    customerName?: string,
    orderItems?: OrderItem[],
    shippingAddress?: string | null,
    invoiceAddress?: string | null,
    status?: string,
    price?: number
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

  static newOrder(
    customerName: string,
    orderItems: OrderItem[],
    invoiceAddress: string | null
  ): Order {
    const order = new Order();
    order.customerName = customerName;
    order.orderItems = orderItems;
    order.createdAt = new Date();
    order.invoiceAddress = invoiceAddress;
    return order;
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

  setDelivery(deliveryAdress: string) {
    if (this.status !== OrderStatus.PENDING && this.status !== OrderStatus.SHIPPING_ADRESS_SET) {
      throw new Error('Order is not paid');
    }
    if (this.totalItems() > 3) {
      this.status = OrderStatus.DELIVERED;
    }

    this.price += Order.SHIPPING_PRICE;
    this.shippingAddress = deliveryAdress;

  }

  totalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  itemTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}