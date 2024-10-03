import { CreateOrderService } from './create-order.service';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';
import { SetInvoiceAddressOrderService } from './set-invoice-address-order.service';
class OrderRepositoryFake {
    async save(order) {
        return order;
    }

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


const orderRepositoryFake =
    new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be created if the orderstatus has not set the shipping address", () => {
    it('should return an error', async () => {
        const setInvoiceAddress = new SetInvoiceAddressOrderService(orderRepositoryFake);

        await expect(
            setInvoiceAddress.execute("1", "123 Main St"),
        ).rejects.toThrow();
    });
});
