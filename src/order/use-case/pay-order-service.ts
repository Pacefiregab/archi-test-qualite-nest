import { BadRequestException } from "@nestjs/common";
import { OrderDTO, OrderItemDTO, OrderStatus } from "../domain/dto/orderDto";
import { Order } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";

export default class PayOrderService {

    existingOrder: Order = {
        id: '1',
        customerName: 'John Doe',
        orderItems: [
            {
                id: '1',
                productName: 'item 1',
                price: 10,
                quantity: 1,
                order: null
            },
        ],
        shippingAddress: 'Shipping address',
        invoiceAddress: 'Invoice address',
        createdAt: new Date(),
        price: 10,
        shippingAddressSetAt: new Date(),
        status: OrderStatus.PENDING,
        paidAt: null
    };



    async payOrder(orderDto: OrderDTO): Promise<string> {
        if (!orderDto || !orderDto.id) {
            throw new BadRequestException('Order ID is required');
        }
        const orderToUpdate: Order = this.getFakeExisitngOrder(orderDto);
        orderToUpdate.status = OrderStatus.PAID;
        orderToUpdate.paidAt = new Date();
        return 'Paid';
    }

    private getFakeExisitngOrder(orderDto: OrderDTO): Order {
        const existingOrder = this.existingOrder;

        if (existingOrder.id !== orderDto.id) {
            throw new BadRequestException('Order ID invalid');
        }

        return existingOrder;
    }
}