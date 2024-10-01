import { OrderItem } from '../entity/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { BadRequestException } from '@nestjs/common';


export class OrderItemDTO {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsInt()
  quantity: number;

  @IsInt()
  price: number;
}

export class OrderDTO {
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  invoiceAddress: string;

  @ValidateNested({ each: true })
  @ArrayMaxSize(5, { message: 'Cannot order more than 5 items' })
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  DELIVERED = "DELIVERED",
  SHIPPING_ADRESS_SET = "SHIPPING_ADRESS_SET",
}

@Entity()
export class Order {

  static MAX_ORDER_ITEMS: number = 5;
  static MIN_ORDER_PRICE: number = 10;
  static MAX_ORDER_PRICE: number = 500;
  static SHIPPING_PRICE: number = 5;

  //the constructor for the fixtures of the class
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

    if (Order.totalItems(orderItems) > Order.MAX_ORDER_ITEMS) {
      throw new BadRequestException('Cannot order more than 5 items');
    }

    if (Order.itemTotalPrice(orderItems) < Order.MIN_ORDER_PRICE) {
      throw new BadRequestException('Total price must be at least 10 euros');
    }
    return order;
  }

  static newOrderFromDTO(orderDTO: OrderDTO): Order {
    const orderItems: OrderItem[] = orderDTO.orderItems.map(item => new OrderItem(item.productName, item.quantity, item.price));
    const order = new Order(
      orderDTO.id,
      orderDTO.customerName,
      orderItems,
      orderDTO.shippingAddress,
      orderDTO.invoiceAddress,
      OrderStatus.PENDING,
      orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
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
    if (Order.totalItems(this.orderItems) > 3) {
      this.status = OrderStatus.DELIVERED;
    }

    this.price += Order.SHIPPING_PRICE;
    this.shippingAddress = deliveryAdress;
    this.shippingAddressSetAt = new Date();

  }

  static totalItems(orderItems: OrderItem[]): number {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  static itemTotalPrice(orderItems: OrderItem[]): number {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}