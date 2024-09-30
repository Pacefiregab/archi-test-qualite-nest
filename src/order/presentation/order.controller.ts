import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateOrderDTO } from '../domain/dto/orderDto';
import { validate } from 'class-validator';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDTO) {
    const { orderItems } = createOrderDto;

    let totalPrice = 0;
    let totalItems = 0;

    orderItems.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    if (totalItems > 5) {
      throw new BadRequestException('Cannot order more than 5 items');
    }

    if (totalPrice < 10) {
      throw new BadRequestException('Total price must be at least 10 euros');
    }

    return 'OK';
  }
}
