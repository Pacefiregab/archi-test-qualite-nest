import { NotFoundException } from '@nestjs/common';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { PdfServiceInterface } from '../port/invoice.generator.interface';

export class GetInvoiceService {
  constructor(private readonly orderRepository: OrderRepositoryInterface,
    private readonly pdfService: PdfServiceInterface
  ) { }

  public async execute(orderId: string): Promise<String> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Pas de commande');
    }

    order.validateInvoice();

    return this.pdfService.generateInvoice(order);
  }
}
