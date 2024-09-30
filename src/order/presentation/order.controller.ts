import { Controller, Get, Post, Body, BadRequestException, Inject } from '@nestjs/common';
import { CreateOrderDTO } from '../domain/dto/orderDto';
import { validate } from 'class-validator';
import { Order } from '../domain/entity/order.entity';
import CreateOrderService from '../use-case/create-order-service';

@Controller('/orders')
export default class OrderController {
  constructor(
    @Inject(CreateOrderService)
    private readonly createOrderService: CreateOrderService,
  ) { }

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDTO): Promise<string> {
    return this.createOrderService.createOrder(createOrderDto);
  }
}
