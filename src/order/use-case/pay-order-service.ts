import { BadRequestException } from "@nestjs/common";
import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";
import { OrderItem } from "../domain/entity/order-item.entity";

export default class PayOrderService {

    existingOrder: Order = new Order('1', 'John Doe', [
        {
            id: '1',
            productName: 'item 1',
            price: 10,
            quantity: 1,
            order: null
        },], 'Shipping address', 'Invoice address', OrderStatus.PENDING, 10);;



    async payOrder(orderDto: OrderDTO): Promise<string> {
        if (!orderDto || !orderDto.id) {
            throw new BadRequestException('Order ID is required');
        }
        const orderToUpdate: Order = this.getFakeExisitngOrder(orderDto);
        orderToUpdate.pay();
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