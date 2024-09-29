import { Controller, Get } from '@nestjs/common';

@Controller('/orders')
export default class OrderController {
  @Get()
  async getOrders() {
    return 'All orders';
  }
}
