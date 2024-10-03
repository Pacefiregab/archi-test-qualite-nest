import { CreateOrderService } from '../use-case/create-order.service';
import { OrderRepositoryInterface } from '../port/order.repository.interface';
import { Order, OrderStatus } from '../entity/order.entity';
import { PayOrderService } from './pay-order.service';
class OrderRepositoryFake {
    async findById(id: string): Promise<Order | null> {
        const mockOrderData = {
            id: id,
            customerName: 'John Doe',
            shippingAddress: '123 Main St',
            invoiceAddress: '123 Main St',
            price: Order.AMOUNT_MAXIMUM + 1,
            status: OrderStatus.SHIPPING_ADDRESS_SET,
            orderItems: [] // Add mock order items if necessary
        };

        const mockOrder = Object.assign(new Order(), mockOrderData);
        return mockOrder;
    }

    async save(order) {
        return order;
    }
}


const orderRepositoryFake =
    new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be created if the total price is greater than the may amount", () => {
    it('should return an error', async () => {
        const payOrderService = new PayOrderService(orderRepositoryFake);

        await expect(
            payOrderService.execute("1"),
        ).rejects.toThrow();
    });
});