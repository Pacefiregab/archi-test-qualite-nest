import { Get, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderController from './presentation/order.controller';
import { Order } from './domain/entity/order.entity';
import { OrderItem } from './domain/entity/order-item.entity';
import { CreateOrderService } from 'src/order/domain/use-case/create-order.service';
import { OrderRepositoryInterface } from 'src/order/domain/port/order.repository.interface';
import OrderRepositoryTypeOrm from 'src/order/infrastructure/order.repository';
import { PayOrderService } from 'src/order/domain/use-case/pay-order.service';
import { CancelOrderService } from 'src/order/domain/use-case/cancel-order.service';
import { SetInvoiceAddressOrderService } from 'src/order/domain/use-case/set-invoice-address-order.service';
import { SetShippingAddressOrderService } from 'src/order/domain/use-case/set-shipping-address-order.service';
import { PdfServiceInterface } from './domain/port/invoice.generator.interface';
import { GetInvoiceService } from './domain/use-case/get-invoice.service';
import PdfService from './infrastructure/pdf.generator';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],

  providers: [
    OrderRepositoryTypeOrm,
    PdfService,
    {
      provide: PayOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => { return new PayOrderService(orderRepository); },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: CancelOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => { return new CancelOrderService(orderRepository); },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetInvoiceAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => { return new SetInvoiceAddressOrderService(orderRepository); },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: SetShippingAddressOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => { return new SetShippingAddressOrderService(orderRepository); },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: CreateOrderService,
      useFactory: (orderRepository: OrderRepositoryInterface) => {
        return new CreateOrderService(orderRepository);
      },
      inject: [OrderRepositoryTypeOrm],
    },
    {
      provide: GetInvoiceService,
      useFactory: (orderRepository: OrderRepositoryInterface, pdfService: PdfService) => {
        return new GetInvoiceService(orderRepository, pdfService);
      },
    }
  ],
})
export class OrderModule { }
