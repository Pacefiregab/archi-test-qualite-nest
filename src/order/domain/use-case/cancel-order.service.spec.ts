import { Order, OrderStatus } from '../entity/order.entity';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { CancelOrderService } from './cancel-order.service';
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


const orderRepositoryFake = new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be canceled if the order has already been canceled", () => {
    it('should return an error', async () => {
        const cancelOrderService = new CancelOrderService(orderRepositoryFake);

        await expect(
            cancelOrderService.execute("1", "j'aime pas mes articles"),
        ).rejects.toThrow();
    });
});

