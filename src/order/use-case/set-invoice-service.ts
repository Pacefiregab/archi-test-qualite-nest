import { Order, OrderDTO, OrderStatus } from "../domain/entity/order.entity";

export default class SetInvoiceService {




    setInvoice(order: OrderDTO): Order {
        if (!order || !order.id) {
            throw new Error('Order ID is required');
        }

        const orderToUpdate: Order = this.getFakeExisitngOrder(order);

        orderToUpdate.setInvoice(order.shippingAddress);
        return orderToUpdate;
    }

    private getFakeExisitngOrder(orderDto: OrderDTO): Order {
        return new Order(orderDto.customerName, orderDto.orderItems, orderDto.invoiceAddress);
    }
}