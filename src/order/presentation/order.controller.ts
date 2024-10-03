import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateOrderCommand,
  Order,
} from 'src/order/domain/entity/order.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { PayOrderService } from 'src/order/domain/use-case/pay-order.service';
import { GetInvoiceService } from '../domain/use-case/get-invoice.service';

@Controller('/orders')
export default class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly payOrderService: PayOrderService,
    private readonly getInvoiceService: GetInvoiceService,
  ) { }

  @Post()
  async createOrder(
    @Body() createOrderCommand: CreateOrderCommand,
  ): Promise<Order> {
    return this.createOrderService.execute(createOrderCommand);
  }

  @Post()
  async payOrder(@Param('id') id: string): Promise<Order> {
    return await this.payOrderService.execute(id);
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string): Promise<any> {
    return await this.getInvoiceService.execute(id);
  }
}
