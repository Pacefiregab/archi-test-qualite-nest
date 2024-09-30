import { Controller, Get, Post, Body, BadRequestException, Inject, Put } from '@nestjs/common';
import { OrderDTO } from '../domain/dto/orderDto';
import { validate } from 'class-validator';
import { Order } from '../domain/entity/order.entity';
import CreateOrderService from '../use-case/create-order-service';
import PayOrderService from '../use-case/pay-order-service';

@Controller('/orders')
export default class OrderController {
  constructor(
    @Inject(CreateOrderService)
    private readonly createOrderService: CreateOrderService,
    @Inject(PayOrderService)
    private readonly payOrderService: PayOrderService
  ) { }

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() createOrderDto: OrderDTO): Promise<string> {
    return this.createOrderService.createOrder(createOrderDto);
  }

  @Put()
  async payOrder(@Body() updateOrderDto: OrderDTO): Promise<string> {
    return this.payOrderService.payOrder(updateOrderDto);
  }
}
