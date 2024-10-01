import { Controller, Get, Post, Body, BadRequestException, Inject, Put } from '@nestjs/common';
import { validate } from 'class-validator';
import { Order, OrderDTO } from '../domain/entity/order.entity';
import CreateOrderService from '../use-case/create-order-service';
import PayOrderService from '../use-case/pay-order-service';
import SetDeliveryAdressService from '../use-case/set-delivery-info';
import SetInvoiceService from '../use-case/set-invoice-service';
import CancelOrderService from '../use-case/cancel-order-service';

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
    private readonly invoiceService: SetInvoiceService,
    @Inject(CancelOrderService)
    private readonly cancelOrderService: CancelOrderService
  ) { }

  @Get()
  async getOrders() {
    return 'All orders';
  }

  @Post()
  async createOrder(@Body() createOrderDto: OrderDTO): Promise<Order> {
    return this.createOrderService.createOrder(createOrderDto);
  }

  @Put()
  async payOrder(@Body() updateOrderDto: OrderDTO): Promise<Order> {
    return this.payOrderService.payOrder(updateOrderDto);
  }

  @Put('/delivery')
  async setDelivery(@Body() updateOrderDto: OrderDTO): Promise<Order> {
    return this.deliveryAdressService.setDelivery(updateOrderDto);
  }


  @Put('/invoice')
  async setInvoice(@Body() updateOrderDto: OrderDTO) : Promise<Order> {
    return this.invoiceService.setInvoice(updateOrderDto);
  }

  @Put('/cancel')
  async cancelOrder(@Body() updateOrderDto: OrderDTO): Promise<Order> {
    return;
  }
}
