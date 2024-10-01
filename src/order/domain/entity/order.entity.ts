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

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
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

  constructor(
    customerName: string,
    orderItems: OrderItemDTO[],
    invoiceAddress: string | null
  ) {
    if (this.getTotalItems(orderItems) > Order.MAX_ORDER_ITEMS) {
      throw new BadRequestException('Cannot order more than 5 items');
    }

    const totalPrice = this.itemTotalPrice();

    if (totalPrice < Order.MIN_ORDER_PRICE) {
      throw new BadRequestException('Total price must be at least 10 euros');
    }

    this.orderItems = orderItems.map(item => new OrderItem(item.productName, item.quantity, item.price));
    this.customerName = customerName;
    this.createdAt = new Date();
    this.price = totalPrice;
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

  @Column({ nullable: true })

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

    if (this.getTotalItems(this.orderItems) < 3) {
      throw new Error('Cannot ship less than 3 items');
    }

    this.status = OrderStatus.SHIPPING_ADRESS_SET;
    this.price += Order.SHIPPING_PRICE;
    this.shippingAddress = deliveryAdress;
    this.shippingAddressSetAt = new Date();

  }

  setInvoice(invoiceAddress: string) {
    if (this.status !== OrderStatus.SHIPPING_ADRESS_SET) {
      throw new Error('Order doesnt have a shipping address');
    }

    if (!invoiceAddress || invoiceAddress === '') {
      invoiceAddress = this.shippingAddress;
    }
    this.status = OrderStatus.SHIPPING_ADRESS_SET;
    this.invoiceAddress = invoiceAddress;
  }

  private getTotalItems(orderItems: { quantity: number }[]): number {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  private itemTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}