import { OrderDTO, OrderStatus } from "../domain/dto/orderDto";
import { Order } from "../domain/entity/order.entity";

export default class SetDeliveryService {

    existingOrder: Order = new Order('1', 'John Doe', [
        {
            id: '1',
            productName: 'item 1',
            price: 10,
            quantity: 1,
            order: null
        },],
        'Invoice address',
        '',
        OrderStatus.PENDING,
        10);


    getDelivery(order: OrderDTO): Order {
        if (!order || !order.id) {
            throw new Error('Order ID is required');
        }
        const orderToUpdate: Order = this.getFakeExisitngOrder(order);
        orderToUpdate.setDelivery(order.shippingAddress);
        return orderToUpdate;
    }

    private getFakeExisitngOrder(orderDto: OrderDTO): Order {
        const existingOrder = this.existingOrder;

        if (existingOrder.id !== orderDto.id) {
            throw new Error('Order ID invalid');
        }

        return existingOrder;
    }
}