import { CreateOrderService } from './create-order.service';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';
import { SetShippingAddressOrderService } from './set-shipping-address-order.service';
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
            status: OrderStatus.PAID,
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

describe("an order can't be created if the orderis already paid", () => {
    it('should return an error', async () => {
        const setShippingAddress = new SetShippingAddressOrderService(orderRepositoryFake);

        await expect(
            setShippingAddress.execute("1", "123 Main St"),
        ).rejects.toThrow();
    });
});
