import { CreateOrderService } from './create-order.service';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';
import { GetInvoiceService } from './get-invoice.service';
import { PdfServiceInterface } from '../port/invoice.generator.interface';
class OrderRepositoryFake {
    async findById(id: string): Promise<Order | null> {
        const mockOrderData = {
            id: id,
            customerName: 'John Doe',
            shippingAddress: '123 Main St',
            invoiceAddress: '123 Main St',
            price: 100,
            status: OrderStatus.CANCELED,
            cancelAt: new Date(),
            cancelReason: 'Customer requested cancellation',
            orderItems: [] // Add mock order items if necessary
        };

        const mockOrder = Object.assign(new Order(), mockOrderData);
        return mockOrder;
    }
}

class PdfGeneratorFake {
    async generateInvoice(order: Order): Promise<any> {
        return 'PDF';
    }
}


const orderRepositoryFake = new OrderRepositoryFake() as OrderRepositoryInterface;
const pdfGeneratorFake = new PdfGeneratorFake() as PdfServiceInterface;

describe("an order can't generate an invoice if the status is not at paid", () => {
    it('should return an error', async () => {
        const getInvoice = new GetInvoiceService(orderRepositoryFake, pdfGeneratorFake);

        await expect(
            getInvoice.execute("1"),
        ).rejects.toThrow();
    });
});