import { Controller, Get, Post, Body, BadRequestException, Inject, Put } from '@nestjs/common';
import { validate } from 'class-validator';
import { OrderDTO } from '../domain/entity/order.entity';
import CreateOrderService from '../use-case/create-order-service';
import PayOrderService from '../use-case/pay-order-service';
import GetDeliveryService from '../use-case/set-delivery-info';

@Controller('/orders')
export default class OrderController {
  constructor(
    @Inject(CreateOrderService)
    private readonly createOrderService: CreateOrderService,
    @Inject(PayOrderService)
    private readonly payOrderService: PayOrderService,
    @Inject(GetDeliveryService)
    private readonly deliveryService: GetDeliveryService
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

  @Post('/delivery')
  async getDelivery(@Body() updateOrderDto: OrderDTO) {
    return this.deliveryService.getDelivery(updateOrderDto);
  }
}
