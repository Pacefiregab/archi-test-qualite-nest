import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderRepository from './infrastructure/order.repository';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import CreateOrderService from './use-case/create-order-service';
import PayOrderService from './use-case/pay-order-service';
import GetDeliveryService from './use-case/set-delivery-info';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    CreateOrderService,
    PayOrderService,
    GetDeliveryService,
  ],
})
export class OrderModule { }
