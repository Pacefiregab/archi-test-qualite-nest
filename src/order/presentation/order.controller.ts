import { Controller, Get, Post, Body, BadRequestException, Inject, Put } from '@nestjs/common';
import { validate } from 'class-validator';
import { OrderDTO } from '../domain/entity/order.entity';
import CreateOrderService from '../use-case/create-order-service';
import PayOrderService from '../use-case/pay-order-service';
import SetDeliveryAdressService from '../use-case/set-delivery-info';
import SetInvoiceService from '../use-case/set-invoice-service';

@Controller('/orders')
export default class OrderController {
  constructor(
    @Inject(CreateOrderService)
    private readonly createOrderService: CreateOrderService,
    @Inject(PayOrderService)
    private readonly payOrderService: PayOrderService,
    @Inject(SetDeliveryAdressService)
    private readonly deliveryAdressService: SetDeliveryAdressService,
    @Inject(SetInvoiceService)
    private readonly invoiceService: SetInvoiceService
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

  @Put('/delivery')
  async setDelivery(@Body() updateOrderDto: OrderDTO) {
    return this.deliveryAdressService.getDelivery(updateOrderDto);
  }


  @Put('/invoice')
  async setInvoice(@Body() updateOrderDto: OrderDTO) {
    return this.invoiceService.setInvoice(updateOrderDto);
  }

  @Put('/cancel')
  async cancelOrder(@Body() updateOrderDto: OrderDTO) {
    return 'Order cancelled';
  }
}
