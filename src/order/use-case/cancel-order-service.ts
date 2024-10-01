import { Order, OrderDTO } from "../domain/entity/order.entity";

export default class SetInvoiceService {

    cancelOrder(order: OrderDTO): Order {
        if (!order || !order.id) {
            throw new Error('Order ID is required');
        }

        const orderToUpdate: Order = this.getFakeExisitngOrder(order);

        orderToUpdate.cancel(order.cancelationReason);

        return orderToUpdate;
    }

    private getFakeExisitngOrder(orderDto: OrderDTO): Order {
        return new Order(orderDto.customerName, orderDto.orderItems, orderDto.invoiceAddress);
    }
}